import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// 1. Pehle path set karo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. PHIR app ko initialize karo (Ye line sabse upar honi chahiye)
const app = express();

const port = process.env.PORT || 8000;

// 3. Middlewares
app.use(cors({
    origin: "https://yobixai-rasd.onrender.com", 
    credentials: true
}));

app.use(express.json());      
app.use(cookieParser());      

// 4. API Routes (Inhe pehle rakhte hain taaki front-end inhe block na kare)
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/public", express.static(path.join(__dirname, "public")));

// 5. Deployment Settings (Static files)
// Dhayan rakho 'dist' folder backend folder ke andar hona chahiye
const frontendPath = path.join(__dirname, "dist"); 
app.use(express.static(frontendPath));

// Sabse last mein ye wildcard route
app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
});

// 6. Server Start
app.listen(port, () => {
    connectDb();
    console.log(`Server is running on port: ${port}`);
});