import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        // 1. Check karo token kahan se aa raha hai (Header ya Cookie)
        let token = req.cookies?.token || req.header("Authorization") || req.header("x-auth-token");

        // 2. Agar "Bearer <token>" format mein hai, toh sirf token nikaalo
        if (token && token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // 3. Verify Token
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. User ID set karo (Aapne genToken mein 'userId' use kiya tha, wahi yahan aayega)
        req.userId = verifyToken.userId;

        if (!req.userId) {
            return res.status(401).json({ message: "Token is invalid: No User ID found" });
        }

        next();
    } catch (error) {
        console.log("JWT Auth Error:", error.message);
        return res.status(401).json({ message: "Token is not valid or expired" });
    }
};

export default isAuth;