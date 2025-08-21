import express from "express";
import { createQuestionSetController } from "../controller/adminController.js";
import { validateTokenMiddleware } from "../middleware/AuthMiddleware.js";
import { adminOnlyMiddleware } from "../middleware/RoleMiddleware.js";

const router = express.Router();

router.post(
  "/questionset/create",
  validateTokenMiddleware,
  adminOnlyMiddleware,
  createQuestionSetController
);

export default router;   // ✅ ESM export
