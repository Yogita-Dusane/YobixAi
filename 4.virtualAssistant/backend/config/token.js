import jwt from "jsonwebtoken";

const genToken = (userId) => { // Removed 'async'
    try {
        // Use the secret from your .env
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { 
            expiresIn: "10d" 
        });
        return token;
    } catch (error) {
        console.error("JWT Signing Error:", error.message);
        return null;
    }
};

export default genToken;