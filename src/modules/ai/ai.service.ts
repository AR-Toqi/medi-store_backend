import { GoogleGenAI } from "@google/genai";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { generateEmbedding } from "../../lib/embeddings";

// Using the unified SDK which is already working for embeddings
const ai = new GoogleGenAI({
  apiKey: config.google_api_key as string,
});

/**
 * Tool definitions for the AI Agent
 */
const tools: any = [
  {
    functionDeclarations: [
      {
        name: "get_medicines",
        description: "Fetch a list of available medicines, optionally filtered by category or search term.",
        parameters: {
          type: "object",
          properties: {
            searchTerm: { type: "string", description: "Search for medicine name or manufacturer" },
            category: { type: "string", description: "Filter by category name" },
            limit: { type: "number", description: "Number of items to return (default 5)" }
          },
        },
      },
      {
        name: "get_medicine_details",
        description: "Fetch detailed information about a specific medicine including price, stock, and description. Provide either medicineId or slug.",
        parameters: {
          type: "object",
          properties: {
            medicineId: { type: "string", description: "The ID of the medicine" },
            slug: { type: "string", description: "The URL slug of the medicine" }
          },
        },
      },
      {
        name: "search_medicines_by_description",
        description: "Search for medicines based on symptoms, effects, or natural language descriptions (e.g., 'medicine for fever').",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "The description or symptoms to search for" },
            limit: { type: "number", description: "Number of matches to return (default 5)" }
          },
          required: ["query"],
        },
      },
      {
        name: "get_categories",
        description: "List all available medicine categories.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    ],
  },
];

/**
 * Execution handlers for the tools
 */
const toolHandlers: Record<string, Function> = {
  get_medicines: async (args: { searchTerm?: string; category?: string; limit?: number }) => {
    const where: any = {};
    if (args.searchTerm) {
      where.OR = [
        { name: { contains: args.searchTerm, mode: 'insensitive' } },
        { manufacturer: { contains: args.searchTerm, mode: 'insensitive' } }
      ];
    }
    if (args.category) {
      where.category = {
        name: { contains: args.category, mode: 'insensitive' }
      };
    }
    return await prisma.medicine.findMany({
      where,
      take: args.limit || 5,
      select: { id: true, name: true, price: true, manufacturer: true, stock: true, description: true, slug: true }
    });
  },
  search_medicines_by_description: async (args: { query: string; limit?: number }) => {
    return await semanticSearchMedicines(args.query, args.limit || 5);
  },
  get_medicine_details: async (args: { medicineId?: string; slug?: string }) => {
    if (!args.medicineId && !args.slug) return null;
    return await prisma.medicine.findFirst({
      where: {
        OR: [
          ...(args.medicineId ? [{ id: args.medicineId }] : []),
          ...(args.slug ? [{ slug: args.slug }] : [])
        ]
      },
      include: { category: true }
    });
  },
  get_categories: async () => {
    return await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, description: true }
    });
  }
};

/**
 * Processes a chat request with the AI agent
 */
export const processAIChat = async (message: string, history: any[] = []) => {
  try {
    const systemInstruction = "You are the Medistore AI Assistant. Help customers find medicines. Be professional. Always include Category, Price, Manufacturer, and Stock Status. Disclaimer: 'Please consult with a certified healthcare professional for medical diagnosis and treatment.'";

    // Gemini requires history to start with 'user' role
    const mappedHistory = history.map(h => ({
      role: h.role === 'bot' ? 'model' : h.role,
      parts: h.parts
    }));
    
    const finalHistory = mappedHistory[0]?.role === 'model' 
      ? mappedHistory.slice(1) 
      : mappedHistory;

    const chat = ai.chats.create({
      model: "models/gemini-3.1-flash-lite-preview",
      history: finalHistory,
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
      }
    });

    let response;
    try {
      response = await chat.sendMessage({ message: message });
    } catch (firstError: any) {
      // If it's a 503 (High Demand), wait 1.5 seconds and try one more time
      if (firstError.status === 503 || firstError.message?.includes("503") || firstError.message?.includes("high demand")) {
        console.log("AI High Demand - Retrying in 1.5s...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        response = await chat.sendMessage({ message: message });
      } else {
        throw firstError;
      }
    }
    
    // Automatic tool handling loop in the unified SDK
    let iteration = 0;
    const maxIterations = 5;

    while (response.functionCalls && response.functionCalls.length > 0 && iteration < maxIterations) {
      const toolResults = await Promise.all(
        response.functionCalls.map(async (call: any) => {
          const handler = call.name ? toolHandlers[call.name] : null;
          const output = handler ? await handler(call.args) : `Tool ${call.name} not found`;
          return {
            functionResponse: {
              name: call.name || "unknown",
              response: { output: JSON.stringify(output) }
            }
          };
        })
      );

      // Sending tool results back
      try {
        response = await chat.sendMessage({ message: toolResults });
      } catch (toolError: any) {
        if (toolError.status === 503 || toolError.message?.includes("503")) {
          console.log("AI High Demand during Tool call - Retrying in 1.5s...");
          await new Promise(resolve => setTimeout(resolve, 1500));
          response = await chat.sendMessage({ message: toolResults });
        } else {
          throw toolError;
        }
      }
      iteration++;
    }

    return response.text;
  } catch (error: any) {
    console.error("AI Service Error - FULL DETAILS:", error);

    const errorMessage = error.message?.toLowerCase() || "";
    const errorStatus = error.status || error.code || "";

    if (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("unavailable")) {
      return "I'm currently experiencing high demand. The pharmacy is a bit crowded! Please try again in a moment.";
    }

    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
      return "I've hit my request limit for the moment. Please wait a few seconds before your next question.";
    }

    return "I'm having a little trouble connecting to my knowledge base right now. Please try again shortly!";
  }
};

/**
 * Performs a semantic search for medicines using vector similarity
 */
export const semanticSearchMedicines = async (query: string, limit: number = 5) => {
  try {
    const queryVector = await generateEmbedding(query, { taskType: "search_query" });

    const medicines = await prisma.$queryRawUnsafe(`
      SELECT 
        m.id, m.name, m.price, m.stock, m.manufacturer, m.description, m."imageUrl", m.slug,
        c.name as "categoryName",
        1 - (m.vector <=> '[${queryVector.join(",")}]'::vector) as similarity
      FROM "Medicine" m
      LEFT JOIN "Category" c ON m."categoryId" = c.id
      WHERE m.vector IS NOT NULL
      ORDER BY similarity DESC
      LIMIT ${limit};
    `);

    return medicines;
  } catch (error: any) {
    console.error("Semantic Search Error:", error);
    throw new Error(error.message || "Failed to perform semantic search.");
  }
};
