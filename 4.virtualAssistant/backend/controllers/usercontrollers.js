import geminiResponse from "../groq.service.js";
import User from "../models/user.model.js";
import moment from "moment";

// 1. GET CURRENT USER
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Get User Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// 2. GET HISTORY
export const getHistory = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("history");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Latest conversation upar dikhane ke liye reverse kiya hai
        res.status(200).json(user.history.reverse());
    } catch (error) {
        console.error("Fetch History Error:", error);
        res.status(500).json({ message: "Error fetching history" });
    }
};
// controllers/usercontrollers.js ke andar ye function add karein
export const deleteHistory = async (req, res) => {
    try {
        const { ids } = req.body; // Frontend se [id1, id2...] array aayega

        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No history selected" });
        }

        // MongoDB query: History array se matching IDs ko remove karne ke liye
        await User.findByIdAndUpdate(req.userId, {
            $pull: { history: { _id: { $in: ids } } }
        });
        
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "Server error while deleting history" });
    }
};
// 3. ASK TO ASSISTANT
export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ response: "User not found" });

        const userName = user.name || "User";
        const assistantName = user.assistantName || "Shifra";

        const gemResult = await geminiResponse(command, assistantName, userName);

        if (!gemResult || gemResult.intent === "error") {
            return res.json({
                intent: "error",
                response: "I'm having trouble connecting to my servers right now."
            });
        }

        let finalResponse = gemResult.response || "Task processed.";

        // Intent logic handling
        switch (gemResult.intent) {
            case 'get_time':
                finalResponse = `The current time is ${moment().format("hh:mm A")}`;
                break;
            case 'get_date':
                finalResponse = `Today's date is ${moment().format("DD MMMM YYYY")}`;
                break;
            case 'get_day':
                finalResponse = `Today is ${moment().format("dddd")}`;
                break;
            case 'get_month':
                finalResponse = `The current month is ${moment().format("MMMM")}`;
                break;
            case 'calculator':
                finalResponse = `The answer is ${gemResult.extra?.calculator_result}`;
                break;
        }

        // --- SAVE TO DATABASE ---
        if (!user.history) user.history = [];
        user.history.push({
            command: command,
            response: finalResponse,
            date: new Date()
        });
        await user.save();
        // -----------------------

        let responsePayload = { ...gemResult, response: finalResponse };

        // Browser Actions handle karne ke liye URLs
        if (gemResult.intent === "google_search") {
            responsePayload.action = "open_url";
            responsePayload.url = `https://www.google.com/search?q=${encodeURIComponent(gemResult.query)}`;
        } else if (gemResult.intent === "youtube_search" || gemResult.intent === "youtube_play") {
            responsePayload.action = "open_url";
            responsePayload.url = `https://www.youtube.com/results?search_query=${encodeURIComponent(gemResult.query)}`;
        } else if (gemResult.intent === "open_app") {
            let appUrl = "";
            const app = gemResult.app_name?.toLowerCase();
            if (app === "instagram") appUrl = "https://www.instagram.com";
            else if (app === "facebook") appUrl = "https://www.facebook.com";
            else if (app === "whatsapp") appUrl = "https://web.whatsapp.com";
            responsePayload.action = "open_url";
            responsePayload.url = appUrl;
        }

        return res.json(responsePayload);

    } catch (error) {
        console.error("Ask Assistant Error:", error);
        return res.status(500).json({ response: "I'm having trouble. Please try again." });
    }
};

// 4. IMAGE UPLOAD
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
        const imageUrl = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;
        res.status(200).json({ success: true, message: "Image uploaded successfully", imageUrl: imageUrl });
    } catch (error) {
        console.error("Upload Controller Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error during upload" });
    }
};

// 5. UPDATE ASSISTANT
export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, assistantImage } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { assistantName, assistantImage } },
            { returnDocument: 'after', runValidators: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};