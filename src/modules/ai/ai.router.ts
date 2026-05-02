import { Router } from "express";
import { AIController } from "./ai.controller";

const router = Router();

/**
 * @route POST /api/ai/chat
 * @desc Chat with the AI medical assistant
 * @access Public (or Restricted based on your auth logic)
 */
router.post("/chat", AIController.chatWithAI);
router.get("/search", AIController.semanticSearch);

export const AIRoutes = router;
