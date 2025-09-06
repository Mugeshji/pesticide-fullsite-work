// index.js

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import route from "./routes/userRoute.js";

dotenv.config();
const app = express();

// ==================== MIDDLEWARE ====================
app.use(bodyParser.json());

// ✅ Allow localhost + deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://pesticide-frontend-hf3f.onrender.com", // your deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Serve uploaded images statically (make sure uploads folder exists in root)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== DATABASE CONNECTION ====================
const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ Missing MONGO_URL environment variable");
  process.exit(1);
}

// Root route
app.get("/", (req, res) => {
  res.send("🌱 Pesticide Backend is Running!");
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
