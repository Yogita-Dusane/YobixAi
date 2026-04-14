import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from "../assets/authBg3.jpg"; 
import myLogo from "../assets/new.png"; 
import { PiEyesFill, PiLightningFill } from "react-icons/pi";
import { BsEyeSlashFill } from "react-icons/bs";
import { userDataContext } from '../context/UserContext';
import axios from "axios";

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const { serverUrl, setUserData } = useContext(userDataContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        setIsSuccess(false);

        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                name, email, password
            }, { withCredentials: true });

            // 1. Update Global State
            setUserData(result.data);
            setLoading(false);
            
            // 2. Show Success UI
            setIsSuccess(true);

            // 3. Wait 2 seconds so user can see the success, then navigate to Sign In
            setTimeout(() => {
                navigate("/signin");
            }, 2000);

        } catch (error) {
            console.log("Signup Error:", error);
            setLoading(false);
            setIsSuccess(false);
            
            // Display error message from backend if it exists
            const errorMsg = error.response?.data?.message || "Signup failed. Please try again.";
            setErr(errorMsg);
        }
    };

    return (
        <div 
            className="w-full min-h-screen bg-cover bg-center flex justify-center items-center p-4" 
            style={{ backgroundImage: `url(${bg})` }}>
            
            <form 
                className='w-full max-w-[480px] bg-black/60 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center gap-6 px-8 py-12 rounded-[40px] border border-white/20'
                autoComplete="off" 
                onSubmit={handleSignUp}
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
                  Sign Up to <span className='bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]'>Yobix AI</span>
                </h1>
                
                {/* Name Input */}
                <div className="w-full">
                    <input 
                        type="text" 
                        placeholder='Full Name' 
                        className='w-full h-[60px] outline-none border-2 border-white/20 bg-white/5 focus:border-cyan-400 text-white placeholder-white px-6 rounded-2xl text-lg transition-all'
                        required 
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
                
                {/* Email Input */}
                <div className="w-full">
                    <input 
                        type="email" 
                        placeholder='Email' 
                        className='w-full h-[60px] outline-none border-2 border-white/20 bg-white/5 focus:border-cyan-400 text-white placeholder-white px-6 rounded-2xl text-lg transition-all'
                        required 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                
                {/* Password Input */}
                <div className='w-full h-[60px] border-2 border-white/20 bg-white/5 rounded-2xl relative focus-within:border-cyan-400 transition-all'>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder='Password' 
                        autoComplete="new-password" 
                        className='w-full h-full rounded-2xl outline-none bg-transparent text-white placeholder-white px-6'
                        required 
                        onChange={(e) => setpassword(e.target.value)}
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
                {err && <p className='text-red-500 text-[16px] font-medium italic text-center'>*{err}</p>}
                
                {isSuccess && (
                    <div className="w-full py-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center font-bold text-sm animate-pulse">
                        Signup Successful!
                    </div>
                )}

                {/* Submit Button */}
                {!isSuccess && (
                    <button 
                        type="submit"
                        disabled={loading}
                        className='w-full h-[60px] mt-4 text-white font-bold bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.7)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? "Loading..." : "Sign Up"}
                    </button>
                )}

                <p className='text-white text-[17px]'>
                    Already have an account? 
                    <span 
                        className='ml-2 text-cyan-400 font-bold cursor-pointer hover:text-white hover:underline transition-all'
                        onClick={() => navigate("/signin")}
                    >
                        Sign In
                    </span>
                </p>
                
            </form> 
        </div>
    );
}

export default SignUp;