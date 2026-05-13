import { Request, Response } from "express";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";
import { processAIChat, semanticSearchMedicines } from "./ai.service";
import { syncMedicineVectors } from "./sync-vectors";

const chatWithAI = catchAsync(async (req: Request, res: Response) => {
  const { message, history } = req.body;
  
  if (!message) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Message is required",
      data: null,
    });
  }

  const response = await processAIChat(message, history);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AI response generated successfully",
    data: {
      message: response,
    },
  });
});

const semanticSearch = catchAsync(async (req: Request, res: Response) => {
  const { query, limit } = req.query;
  
  if (!query) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Search query is required",
      data: null,
    });
  }

  const results = await semanticSearchMedicines(query as string, Number(limit) || 5);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semantic search results fetched successfully",
    data: results,
  });
});

const syncVectors = catchAsync(async (req: Request, res: Response) => {
  // This might take a while, so we run it and respond when done
  // For production, you'd want this to be a background task
  await syncMedicineVectors();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine vectors synchronized successfully",
    data: null,
  });
});

export const AIController = {
  chatWithAI,
  semanticSearch,
  syncVectors,
};
