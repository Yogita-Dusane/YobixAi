import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path"; // Path module zaroori hai
import { fileURLToPath } from "url";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ES Modules mein __dirname set karna
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

const port = process.env.PORT || 8000;

app.use(express.json());      
app.use(cookieParser());      

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.get("/", (req, res) => {
    res.send("Yobix AI Server is Running...");
});

app.listen(port, () => {
    connectDb();
    console.log(`Server is running on port: ${port}`);
});