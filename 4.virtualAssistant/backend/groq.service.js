import axios from "axios";

const geminiResponse = async (command, assistantName = "Shifra", userName = "User") => {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const data = {
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are ${assistantName}, a professional AI assistant. 
                - If the user speaks in English, you MUST respond in English.
                - If the user speaks in Hindi, you MUST respond in Hindi.
                - Follow the language used by the user strictly.
                - If user asks to search YouTube, return JSON: {"intent": "youtube_search", "query": "topic", "response": "Searching YouTube..."}.
                - If user asks to open YouTube, return JSON: {"intent": "open_url", "url": "https://www.youtube.com", "response": "Opening YouTube..."}.
                - Output ONLY valid JSON.`
            },
            { role: "user", content: command }
        ],
        response_format: { type: "json_object" }
    };

    try {
        const res = await axios.post(url, data, {
            headers: { 
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        return JSON.parse(res.data.choices[0].message.content);
    } catch (err) {
        console.error("Groq API Error:", err);
        return { intent: "error", response: "I'm having trouble connecting to my brain right now." };
    }
};

export default geminiResponse;