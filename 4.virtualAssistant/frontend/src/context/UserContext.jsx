import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

export const userDataContext = createContext();

axios.defaults.withCredentials = true;

export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const serverUrl = "https://yobixai.onrender.com";
    
    // useRef ka use karke hum track rakhenge ki kya data fetch ho chuka hai
    const isFetched = useRef(false);

    const handleCurrentUser = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUserData(null);
            setLoading(false);
            return;
        }

        try {
            // Hum setLoading(true) sirf tabhi karenge jab userData pehle se na ho
            if (!userData) setLoading(true);

            const res = await axios.get(`${serverUrl}/api/auth/current`, {
                headers: { 
                    "Authorization": `Bearer ${token}` 
                }
            });

            // Loop Rokne Ka Sabse Zaroori Step: 
            // Sirf tabhi update karein agar naya data purane data se sach mein alag ho
            if (JSON.stringify(res.data) !== JSON.stringify(userData)) {
                console.log("📥 Updating State with New Data");
                setUserData(res.data);
            }
        } catch (error) {
            console.error("❌ Context API Error:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                setUserData(null);
            }
        } finally {
            setLoading(false);
        }
    }, [serverUrl, userData]); // userData ko dependency mein rakha hai check karne ke liye

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

    useEffect(() => {
        // Sirf tabhi fetch karein jab token ho aur data pehle se na ho
        const token = localStorage.getItem("token");
        if (token && !isFetched.current) {
            console.log("🚀 Initial Fetch Running...");
            handleCurrentUser();
            isFetched.current = true; // Mark as fetched
        } else if (!token) {
            setLoading(false);
        }
    }, [handleCurrentUser]);

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