import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// 1. Path settings
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. App Initialization
const app = express();
const port = process.env.PORT || 8000;

// 3. Middlewares
app.use(cors({
    origin: "https://yobixai-rasd.onrender.com", // Aapka Frontend URL
    credentials: true
}));

app.use(express.json());      
app.use(cookieParser());      

// 4. API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/public", express.static(path.join(__dirname, "public")));

// 5. Deployment Settings (Frontend Static Files)
const frontendPath = path.join(__dirname, "dist"); 

if (fs.existsSync(frontendPath)) {
    // Agar dist folder mil gaya toh static serve karein
    app.use(express.static(frontendPath));
    
    // Sahi Wildcard Route for Node v22
    app.get("/*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
} else {
    // Agar dist folder nahi mila toh server crash nahi hoga
    app.get("/", (req, res) => {
        res.status(200).send("Backend is running successfully! (Frontend 'dist' folder not found in backend directory)");
    });
}

// 6. Server Start
app.listen(port, () => {
    connectDb();
    console.log(`Server is running on port: ${port}`);
});