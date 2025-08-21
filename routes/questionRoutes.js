import express from "express";
import {
  listQuestionSetController,
  getQuestionSetController,
  saveAttemptedQuestionController,
} from "../controller/questionController.js";
import { validateTokenMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/set/list", validateTokenMiddleware, listQuestionSetController);
router.get("/set/:id", validateTokenMiddleware, getQuestionSetController);
router.post(
  "/answer/attempt",
  validateTokenMiddleware,
  saveAttemptedQuestionController
);

export default router;   // ✅ use ESM export
