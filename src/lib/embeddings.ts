import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

const getClient = () => {
  if (!config.google_api_key) {
    throw new Error("GOOGLE_API_KEY is missing. Cannot initialize embeddings model.");
  }
  return new GoogleGenerativeAI(config.google_api_key as string);
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
    const model = client.getGenerativeModel({
      model: "models/text-embedding-004",
    });

    const result = await model.embedContent(text);

    if (result.embedding.values) {
      return result.embedding.values;
    }

    throw new Error("No embeddings returned from model");
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate embedding");
  }
};
