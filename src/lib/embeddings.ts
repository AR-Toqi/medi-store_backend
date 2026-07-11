import { GoogleGenAI } from "@google/genai";
import { config } from "../config";

const getClient = () => {
  if (!config.google_api_key) {
    throw new Error("GOOGLE_API_KEY is missing. Cannot initialize embeddings model.");
  }
  return new GoogleGenAI({ apiKey: config.google_api_key as string });
};

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

const mapTaskType = (taskType?: EmbeddingTaskType): string => {
  switch (taskType) {
    case "search_query": return "RETRIEVAL_QUERY";
    case "search_document": return "RETRIEVAL_DOCUMENT";
    case "classification": return "CLASSIFICATION";
    case "clustering": return "CLUSTERING";
    case "similarity": return "SEMANTIC_SIMILARITY";
    case "fact_checking": return "RETRIEVAL_QUERY";
    default: return "RETRIEVAL_QUERY";
  }
};

export const generateEmbedding = async (
  text: string,
  options?: EmbeddingOptions
): Promise<number[]> => {
  try {
    const client = getClient();

    const result = await client.models.embedContent({
      model: "text-embedding-004",
      contents: text,
      config: {
        taskType: mapTaskType(options?.taskType),
      },
    });

    if (result.embeddings && result.embeddings.length > 0 && result.embeddings[0].values) {
      return result.embeddings[0].values;
    }

    throw new Error("No embeddings returned from model");
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate embedding");
  }
};
