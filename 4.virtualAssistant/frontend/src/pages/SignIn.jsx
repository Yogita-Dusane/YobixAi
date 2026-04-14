import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from "../assets/authBg3.jpg"; 
import myLogo from "../assets/new.png"; 
import { PiEyesFill, PiLightningFill } from "react-icons/pi";
import { BsEyeSlashFill } from "react-icons/bs";
import { userDataContext } from '../context/UserContext';
import axios from "axios";

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    
    // ✅ SAB KUCH EK HI LINE MEIN: Jo jo chahiye sab yahan se nikal lo
    const { serverUrl, setUserData, handleCurrentUser } = useContext(userDataContext);
    
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // ... baaki ka handleSignIn function niche
    const [err, setErr] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
const handleSignIn = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    console.log("Attempting Login with:", { email, password }); // Check input data

    const res = await axios.post(`${serverUrl}/api/auth/signin`, {
      email: email,
      password: password
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      // Wait for context to update before moving
      await handleCurrentUser(); 
      navigate("/customize");
    }
  } catch (err) {
    // 🚨 EXACT ERROR CATCHING logic
    if (err.response) {
      // Backend ne response diya par status 400/401/500 hai
      console.error("Backend Error Data:", err.response.data);
      alert(`Error: ${err.response.data.message || "Invalid Credentials"}`);
    } else if (err.request) {
      // Request gayi par Backend se koi jawab nahi aaya (Server Down or CORS)
      console.error("No Response from Server. Check if Backend is running on Port 8000");
      alert("Server is not responding. Please check your backend.");
    } else {
      // Kuch aur hi phat gaya
      console.error("Error Message:", err.message);
      alert("Request Setup Error: " + err.message);
    }
  } finally {
    setLoading(false);
  }
};
    return (
        <div 
            className="w-full min-h-screen bg-cover bg-center flex justify-center items-center p-4" 
            style={{ backgroundImage: `url(${bg})` }}>
            
            <form 
                className='w-full max-w-[480px] bg-black/60 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center gap-6 px-8 py-12 rounded-[40px] border border-white/20'
                autoComplete="off" 
                onSubmit={handleSignIn}
            >
                {/* Logo Section */}
                <div className="relative flex items-center justify-center w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
                        <img 
                            src={myLogo} 
                            alt="Yobix Logo" 
                            className="w-full h-full object-contain mix-blend-screen scale-150 relative z-10" 
                        />
                        <PiLightningFill className="absolute top-0 right-0 text-yellow-400 text-3xl animate-bounce z-20" />
                    </div>
                </div>
                      
                <h1 className='text-white text-3xl font-bold text-center tracking-tight'>
                    Sign In to <span className='bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]'>Yobix AI</span>
                </h1>
                
                {/* Email Input */}
                <div className="w-full">
                    <input 
                        type="email" 
                        placeholder='Email' 
                        autoComplete="off" 
                        className='w-full h-[60px] outline-none border-2 border-white/20 bg-white/5 focus:border-cyan-400 text-white placeholder-white px-6 rounded-2xl text-lg transition-all focus:shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                        required 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                
                {/* Password Input */}
                <div className='w-full h-[60px] border-2 border-white/20 bg-white/5 rounded-2xl relative focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all'>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder='Password' 
                        autoComplete="current-password" 
                        className='w-full h-full rounded-2xl outline-none bg-transparent text-white placeholder-white px-6'
                        required 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-5">
                        {showPassword ? (
                            <BsEyeSlashFill className='w-6 h-6 text-cyan-400 cursor-pointer' onClick={() => setShowPassword(false)} />
                        ) : (
                            <PiEyesFill className='w-6 h-6 text-white/50 hover:text-white cursor-pointer transition-colors' onClick={() => setShowPassword(true)} />
                        )}
                    </div>
                </div>

                {/* Error & Success Messages */}
                {err.length > 0 && <p className='text-red-500 text-[17px] font-medium'>*{err}</p>}
                
                {isSuccess && (
                    <div className="w-full py-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center font-bold text-sm animate-pulse">
                        Sign In Successful!
                    </div>
                )}

                {/* Submit Button */}
                {!isSuccess && (
                    <button 
                        type="submit"
                        disabled={loading}
                        className='w-full h-[60px] mt-4 text-white font-bold bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.7)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50'
                    >
                        {loading ? "Verifying..." : "Sign In"}
                    </button>
                )}

                <p className='text-white text-[18px]'>
                    Want to create a new account? 
                    <span 
                        className='ml-2 text-cyan-400 font-bold cursor-pointer hover:text-white hover:underline transition-all'
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </p>
                
            </form> 
        </div>
    );
}

export default SignIn;