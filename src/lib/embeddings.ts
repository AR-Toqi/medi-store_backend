import { GoogleGenAI } from "@google/genai";
import { config } from "../config";

const ai = new GoogleGenAI({
  apiKey: config.google_api_key as string,
});

export type EmbeddingTaskType = 
  | "search_query" 
  | "search_document" 
  | "classification" 
  | "clustering" 
  | "similarity" 
  | "fact_checking" 
  | "code_retrieval";

interface EmbeddingOptions {
  taskType?: EmbeddingTaskType;
  title?: string;
}

/**
 * Formats the text with task instructions as recommended for gemini-embedding-2.
 */
const formatEmbeddingPrompt = (text: string, options?: EmbeddingOptions): string => {
  const { taskType, title } = options || {};
  
  switch (taskType) {
    case "search_query":
      return `task: search result | query: ${text}`;
    case "fact_checking":
      return `task: fact checking | query: ${text}`;
    case "code_retrieval":
      return `task: code retrieval | query: ${text}`;
    case "classification":
      return `task: classification | query: ${text}`;
    case "clustering":
      return `task: clustering | query: ${text}`;
    case "similarity":
      return `task: sentence similarity | query: ${text}`;
    case "search_document":
      return `title: ${title || "none"} | text: ${text}`;
    default:
      // If no task type is provided, we return the raw text
      return text;
  }
};

/**
 * Converts a string of text into a vector embedding using the gemini-embedding-2 model.
 * Automatically applies task-specific formatting if taskType is provided.
 */
export const generateEmbedding = async (
  text: string, 
  options?: EmbeddingOptions
): Promise<number[]> => {
  try {
    const formattedText = formatEmbeddingPrompt(text, options);
    
    const response = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: formattedText,
    });

    const firstEmbedding = response.embeddings?.[0];
    if (firstEmbedding?.values) {
      return firstEmbedding.values as number[];
    }
    
    throw new Error("No embeddings returned from model");
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
};
