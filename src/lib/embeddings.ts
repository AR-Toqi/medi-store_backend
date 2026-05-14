import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { config } from "../config";

const getModel = () => {
  if (!config.google_api_key) {
    throw new Error("GOOGLE_API_KEY is missing. Cannot initialize embeddings model.");
  }
  const genAI = new GoogleGenerativeAI(config.google_api_key as string);
  return genAI.getGenerativeModel({ model: "text-embedding-004" });
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

const mapTaskType = (taskType?: EmbeddingTaskType): TaskType => {
  switch (taskType) {
    case "search_query": return TaskType.RETRIEVAL_QUERY;
    case "search_document": return TaskType.RETRIEVAL_DOCUMENT;
    case "classification": return TaskType.CLASSIFICATION;
    case "clustering": return TaskType.CLUSTERING;
    case "similarity": return TaskType.SEMANTIC_SIMILARITY;
    case "fact_checking": return TaskType.RETRIEVAL_QUERY; // Fallback to RETRIEVAL_QUERY
    default: return TaskType.RETRIEVAL_QUERY;
  }
};


export const generateEmbedding = async (
  text: string,
  options?: EmbeddingOptions
): Promise<number[]> => {
  try {
    const result = await getModel().embedContent({
      content: { role: "user", parts: [{ text }] },
      taskType: mapTaskType(options?.taskType),
      title: options?.title,
    } as any);

    if (result.embedding?.values) {
      return result.embedding.values;
    }

    throw new Error("No embeddings returned from model");
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate embedding");
  }
};
