import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import questionRouter from "./routes/questionRoutes.js";

dotenv.config();

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.send("Hello MongoDB Atlas!");
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/questions", questionRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "professor_database" })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB connection error:", err));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});

export default app;
