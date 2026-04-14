import express from "express";
import { 
    signUp, 
    login, 
    logOut 
} from "../controllers/auth.controllers.js";

// User controllers import (Jo humne abhi fix kiye hain)
import { 
    getCurrentUser, 
    getHistory, 
    askToAssistant, 
    updateAssistant,
    uploadImage 
} from "../controllers/usercontrollers.js";

import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js"; // Multer file upload ke liye

const authRouter = express.Router();

// --- Auth Routes ---
authRouter.post("/signup", signUp);
authRouter.post("/signin", login);
authRouter.get("/logout", isAuth, logOut);

// --- User & AI Assistant Routes (Protected) ---
authRouter.get("/current", isAuth, getCurrentUser);

// 🔥 History fetch karne ke liye
authRouter.get("/history", isAuth, getHistory);

// 🔥 AI se baat karne ke liye
authRouter.post("/asktoassistant", isAuth, askToAssistant);

// 🔥 Assistant update karne ke liye
authRouter.put("/update-assistant", isAuth, updateAssistant);

// 🔥 Image upload karne ke liye
authRouter.post("/upload", isAuth, upload.single("image"), uploadImage);

export default authRouter;