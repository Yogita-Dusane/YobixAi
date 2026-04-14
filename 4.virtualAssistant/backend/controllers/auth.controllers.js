import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existEmail = await User.findOne({ email })
        
        if (existEmail) {
            return res.status(400).json({ message: "Email already exists!" })
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters!" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, password: hashPassword, email })
        
        const token = genToken(user._id)
        
        // Cookie for browser
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        // 🔥 Token response mein bhejna zaroori hai
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token 
        });
    } catch (error) {
        return res.status(500).json({ message: `Signup error: ${error.message}` })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Email does not exist!" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" })
        }

        const token = genToken(user._id)
        
        // Cookie set karna
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        // 🔥 FIXED: Login response mein bhi token add kar diya
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            assistantName: user.assistantName,
            assistantImage: user.assistantImage,
            token: token // <--- Frontend ko ye chahiye!
        });

    } catch (error) {
        return res.status(500).json({ message: `Login error: ${error.message}` })
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Logout error: ${error.message}` })
    }
}