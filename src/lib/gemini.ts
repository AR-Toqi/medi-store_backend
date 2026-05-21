import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

let ai: GoogleGenerativeAI | null = null;
const getAI = () => {
  if (!ai) {
    if (!config.google_api_key) {
      throw new Error("GOOGLE_API_KEY is missing. Cannot initialize AI.");
    }
    ai = new GoogleGenerativeAI(config.google_api_key as string);
  }
  return ai;
};

/**
 * Generates text response using Gemini 3 Flash Preview.
 */
export const generateChatResponse = async (prompt: string): Promise<string> => {
  try {
    const model = getAI().getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const response = await model.generateContent(prompt);

    return response.response.text() || "No response generated";
  } catch (error) {
    throw new Error("Failed to generate AI response");
  }
};
