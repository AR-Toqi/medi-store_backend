import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config";
import { prisma } from "../../lib/prisma";
import { generateEmbedding } from "../../lib/embeddings";

const genAI = new GoogleGenerativeAI(config.google_api_key as string);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are the Medistore AI Assistant. Help customers find medicines. Be professional. Always include Category, Price, Manufacturer, and Stock Status. Disclaimer: 'Please consult with a certified healthcare professional for medical diagnosis and treatment.'",
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
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'bot' ? 'model' : h.role,
        parts: [{ text: h.parts }]
      })),
      tools: tools,
    });

    let result;
    try {
      result = await chat.sendMessage(message);
    } catch (firstError: any) {
      if (firstError.status === 503 || firstError.message?.includes("503") || firstError.message?.includes("high demand")) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = await chat.sendMessage(message);
      } else {
        throw firstError;
      }
    }
    
    let response = result.response;
    let iteration = 0;
    const maxIterations = 5;

    while (response.functionCalls()?.length && iteration < maxIterations) {
      const functionCalls = response.functionCalls();
      const toolResults = await Promise.all(
        functionCalls!.map(async (call) => {
          const handler = toolHandlers[call.name];
          const output = handler ? await handler(call.args) : { error: `Tool ${call.name} not found` };
          return {
            functionResponse: {
              name: call.name,
              response: { content: output }
            }
          };
        })
      );

      try {
        result = await chat.sendMessage(toolResults);
        response = result.response;
      } catch (toolError: any) {
        if (toolError.status === 503 || toolError.message?.includes("503")) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          result = await chat.sendMessage(toolResults);
          response = result.response;
        } else {
          throw toolError;
        }
      }
      iteration++;
    }

    return response.text();
  } catch (error: any) {
    const errorMessage = error.message?.toLowerCase() || "";
    
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
    throw new Error(error.message || "Failed to perform semantic search.");
  }
};
