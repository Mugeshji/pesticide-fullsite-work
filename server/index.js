import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/userRoute.js";

dotenv.config();
const app = express();

// ==================== MIDDLEWARE ====================
app.use(bodyParser.json());

// ✅ Allow frontend to connect (in production, set actual frontend URL in env)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ✅ Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// ==================== DATABASE CONNECTION ====================
const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ Missing MONGO_URL environment variable");
  process.exit(1);
}

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// ✅ Mongoose connection with better error handling
mongoose
  .connect(MONGO_URL, {
    serverSelectionTimeoutMS: 10000, // helpful for clear timeout errors
  })
  .then(() => {
    console.log("✅ MongoDB connection successful");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// ==================== ROUTES ====================
app.use("/api", route);

// ✅ Fallback route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
