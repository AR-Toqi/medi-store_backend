import { GoogleGenAI, Type } from "@google/genai";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { generateEmbedding } from "../../lib/embeddings";

const getClient = () => {
  if (!config.google_api_key) {
    throw new Error("GOOGLE_API_KEY is missing. Cannot initialize AI model.");
  }
  return new GoogleGenAI({ apiKey: config.google_api_key as string });
};

const SYSTEM_INSTRUCTION = "You are the Medistore AI Assistant. Help customers find medicines. Be professional. Always include Category, Price, Manufacturer, and Stock Status. Disclaimer: 'Please consult with a certified healthcare professional for medical diagnosis and treatment.'";

/**
 * Tool definitions for the AI Agent (new @google/genai SDK format)
 */
const tools: any = [
  {
    functionDeclarations: [
      {
        name: "get_medicines",
        description: "Fetch a list of available medicines, optionally filtered by category or search term.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            searchTerm: { type: Type.STRING, description: "Search for medicine name or manufacturer" },
            category: { type: Type.STRING, description: "Filter by category name" },
            limit: { type: Type.NUMBER, description: "Number of items to return (default 5)" }
          },
        },
      },
      {
        name: "get_medicine_details",
        description: "Fetch detailed information about a specific medicine including price, stock, and description. Provide either medicineId or slug.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            medicineId: { type: Type.STRING, description: "The ID of the medicine" },
            slug: { type: Type.STRING, description: "The URL slug of the medicine" }
          },
        },
      },
      {
        name: "search_medicines_by_description",
        description: "Search for medicines based on symptoms, effects, or natural language descriptions (e.g., 'medicine for fever').",
        parameters: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING, description: "The description or symptoms to search for" },
            limit: { type: Type.NUMBER, description: "Number of matches to return (default 5)" }
          },
          required: ["query"],
        },
      },
      {
        name: "get_categories",
        description: "List all available medicine categories.",
        parameters: {
          type: Type.OBJECT,
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
 * Uses the new @google/genai SDK (ai.chats.create + chat.sendMessage)
 */
export const processAIChat = async (message: string, history: any[] = []) => {
  try {
    console.log("AI Chat - Starting process with message:", message);
    console.log("AI Chat - History length:", history.length);

    const client = getClient();
    console.log("AI Chat - Client initialized successfully");

    // Format history for the new SDK: expects { role, parts: [{ text }] }
    const formattedHistory = history.map(h => ({
      role: h.role === 'bot' ? 'model' : 'user',
      parts: [{ text: typeof h.parts === 'string' ? h.parts : String(h.parts) }]
    }));

    // Create chat session using the new SDK
    const chat = client.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
      },
      history: formattedHistory,
    });

    let result;
    try {
      result = await chat.sendMessage({ message });
    } catch (firstError: any) {
      if (firstError.status === 503 || firstError.message?.includes("503") || firstError.message?.includes("high demand")) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = await chat.sendMessage({ message });
      } else {
        throw firstError;
      }
    }

    // Handle function calling loop (new SDK uses .functionCalls as a property, not a method)
    let iteration = 0;
    const maxIterations = 5;

    while (result.functionCalls && result.functionCalls.length > 0 && iteration < maxIterations) {
      const functionCalls = result.functionCalls;
      console.log("AI Chat - Function calls:", functionCalls.map((fc: any) => fc.name));

      // Execute each function call and collect results
      const functionResponses = await Promise.all(
        functionCalls.map(async (call: any) => {
          const handler = toolHandlers[call.name];
          const output = handler ? await handler(call.args) : { error: `Tool ${call.name} not found` };

          return {
            name: call.name,
            response: output,
          };
        })
      );

      // Send function responses back to the model
      try {
        result = await chat.sendMessage({
          message: functionResponses.map(fr => ({
            functionResponse: fr,
          })),
        });
      } catch (toolError: any) {
        if (toolError.status === 503 || toolError.message?.includes("503")) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          result = await chat.sendMessage({
            message: functionResponses.map(fr => ({
              functionResponse: fr,
            })),
          });
        } else {
          throw toolError;
        }
      }
      iteration++;
    }

    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error("AI Service Error - Full Error:", error);
    console.error("Error message:", error.message);
    console.error("Error status:", error.status);
    console.error("Error code:", error.code);
    console.error("Error details:", JSON.stringify(error, null, 2));

    const errorMessage = error.message?.toLowerCase() || "";

    if (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("unavailable")) {
      return "I'm currently experiencing high demand. The pharmacy is a bit crowded! Please try again in a moment.";
    }

    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("rate limit")) {
      return "I've hit my request limit for the moment. Please wait a few seconds before your next question.";
    }

    if (errorMessage.includes("api key") || errorMessage.includes("401") || errorMessage.includes("403") || errorMessage.includes("unauthorized")) {
      return "AI authentication failed. Please check that GOOGLE_API_KEY is configured correctly.";
    }

    if (errorMessage.includes("network") || errorMessage.includes("fetch") || errorMessage.includes("econnrefused")) {
      return "I'm having network connectivity issues. Please check your internet connection.";
    }

    if (errorMessage.includes("model") || errorMessage.includes("not found")) {
      return "AI model configuration error. Please check the model settings.";
    }

    return `AI Service Error: ${error.message || "Unknown error occurred"}`;
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
    throw new Error(error.message || "Failed to perform semantic search.");
  }
};
