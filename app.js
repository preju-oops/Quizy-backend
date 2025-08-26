var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/userRoutes");
var adminRouter = require("./routes/adminRoutes");
var questionRouter = require("./routes/questionRoutes");

var app = express();

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/questions", questionRouter);

// MongoDB connection
const mongoose = require("mongoose");

async function main() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "professor_database",
    });
    console.log("Database connected successfully:", conn.connection.name);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}
main();

module.exports = app;
