import { GoogleGenAI } from "@google/genai";
import { config } from "../config";

let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!ai) {
    if (!config.google_api_key) {
      throw new Error("GOOGLE_API_KEY is missing. Cannot initialize AI.");
    }
    ai = new GoogleGenAI({ apiKey: config.google_api_key as string });
  }
  return ai;
};

/**
 * Generates text response using Gemini 3 Flash Preview.
 */
export const generateChatResponse = async (prompt: string): Promise<string> => {
  try {
    const client = getAI();

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "No response generated";
  } catch (error) {
    throw new Error("Failed to generate AI response");
  }
};

