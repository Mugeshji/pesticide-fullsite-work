import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/userRoute.js";

const app = express();
dotenv.config();

// ==================== MIDDLEWARE ====================
app.use(bodyParser.json());

// ✅ Allow frontend to connect (React runs on 3000)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// ==================== DATABASE CONNECTION ====================
const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

app.get('/',(req,res)=>{
    res.send('Hello World');   
})

mongoose.connect(MONGOURL)
  .then(() => {
    console.log("✅ MongoDB connection successful");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((error) => console.log("❌ MongoDB connection error:", error));

// ==================== ROUTES ====================
app.use("/api", route);

// ✅ Fallback route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
