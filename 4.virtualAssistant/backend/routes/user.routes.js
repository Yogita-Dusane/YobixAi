import express from "express";
import { 
    updateAssistant, 
    getCurrentUser, 
    askToAssistant, 
    uploadImage,
    getHistory,
    deleteHistory 
} from "../controllers/usercontrollers.js";

import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

/**
 * @description GET ROUTES
 */

// User ki profile details fetch karne ke liye
userRouter.get("/current", isAuth, getCurrentUser); 

// Chat history fetch karne ke liye
userRouter.get("/history", isAuth, getHistory); 


/**
 * @description POST ROUTES
 */

// Gallery se image upload karne ke liye
userRouter.post("/upload", isAuth, upload.single("image"), uploadImage);

// Assistant ka naam aur image update karne ke liye
userRouter.post("/update-assistant", isAuth, updateAssistant);

// AI (Gemini) se sawal puchne ke liye
userRouter.post("/asktoassistant", isAuth, askToAssistant);

// Chat history delete karne ke liye (Single ya Bulk delete)
userRouter.post("/delete-history", isAuth, deleteHistory);


export default userRouter;