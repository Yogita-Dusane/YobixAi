import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const userDataContext = createContext();

// Global Axios Setting (Cookies ke liye)
axios.defaults.withCredentials = true;

export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const serverUrl = "http://localhost:8000";

    // 1. Function ko pehle define kiya useCallback ke saath
    const handleCurrentUser = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUserData(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log("📡 Sending Request to:", `${serverUrl}/api/auth/current`);
            
            const res = await axios.get(`${serverUrl}/api/auth/current`, {
                headers: { 
                    "x-auth-token": token,
                    "Authorization": `Bearer ${token}`
                }
            });
            
            console.log("📥 Raw Response from Server:", res.data);
            
            if (res.data) {
                setUserData(res.data);
                console.log("✅ UserData State Updated!"); 
            }
        } catch (error) {
            console.error("❌ Context API Error:", error.response?.data || error.message);
            // Agar token invalid ho toh use remove kar dena chahiye
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                setUserData(null);
            }
        } finally {
            setLoading(false);
        }
    }, [serverUrl]); // Dependency sirf serverUrl hai

    const logout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`);
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            localStorage.removeItem("token");
            setUserData(null);
            window.location.href = "/signin";
        }
    };

    // 2. useEffect ko function definitions ke NEECHE rakha hai
    useEffect(() => {
        console.log("🚀 Context Mount: Fetching User...");
        handleCurrentUser(); 
    }, [handleCurrentUser]); // Ab ye loop nahi karega kyunki handleCurrentUser memoized hai

    return (
        <userDataContext.Provider value={{ 
            userData, 
            setUserData, 
            loading, 
            handleCurrentUser, 
            logout,
            serverUrl 
        }}>
            {children}
        </userDataContext.Provider>
    );
};