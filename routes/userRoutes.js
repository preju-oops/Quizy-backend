import express from "express";
import { 
  createUserController,
  loginHandleController,
  getUserListController
} from "../controller/userController.js";

import { validateTokenMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  res.json({
    message: "User Controller is working",
  });
});

router.post("/create", createUserController);
router.post("/login", loginHandleController);
router.get("/list", validateTokenMiddleware, getUserListController);

export default router;   // ✅ ESM export
