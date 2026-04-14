import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    assistantName: {
        type: String,
        default: "Shifra" // Default value dena acchi practice hai
    },
    assistantImage: {
        type: String,
        default: "robo5.jpg"
    },
    // 🔥 FIXED: History ko schema ke andar sahi se define kiya gaya hai
    history: [
        {
            command: { type: String },
            response: { type: String },
            date: { type: Date, default: Date.now }
        }
    ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;