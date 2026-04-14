// Customize.jsx ke top par ye hona chahiye
import React, { useState, useContext, useRef } from 'react'; 
import axios from 'axios';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import { IoArrowBackOutline } from "react-icons/io5";
import hoverSound from "../assets/hover.mp3";
// Import all your images

import robo0 from "../assets/robo0.jpg";
import robo1 from "../assets/robo1.jpg";
import newrobo from "../assets/newrobo.jpg";
import robo2 from "../assets/robo2.jpg";
import robo11 from "../assets/robo11.jpg";
import robo3 from "../assets/robo3.jpg";
import robo7 from "../assets/robo7.jpg";
import robo4 from "../assets/robo4.jpg";
import robo10 from "../assets/robo10.jpg";
import robo6 from "../assets/robo6.jpg";
import robo5 from "../assets/robo5.jpg";
import robo8 from "../assets/robo8.jpg";
import robo9 from "../assets/robo9.jpg";


function Customize() {
  // 1. Yahan serverUrl ko add karein
  const { userData, setUserData, serverUrl } = useContext(userDataContext); 
  const navigate = useNavigate();
  const audioRef = useRef(new Audio(hoverSound));
  const staticRobots = [robo0, robo1, newrobo, robo2, robo11, robo3, robo7, robo4, robo10, robo6, robo5, robo8, robo9];

  
const [assistantImage, setAssistantImage] = useState(""); 
  const [selectedRobot, setSelectedRobot] = useState(null);

  const playHoverSound = () => {
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0.2;
            audioRef.current.play().catch(e => console.log("Autoplay blocked by browser"));
};
};

 const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview for immediate feedback
    const objectUrl = URL.createObjectURL(file);
    
    // Check if setAssistantImage exists before calling it
    if (typeof setAssistantImage === "function") {
        setAssistantImage(objectUrl);
    } else {
        console.error("Critical Error: setAssistantImage state updater is not defined.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
        console.log("📡 System: Initiating image upload...");
        
        const res = await axios.post(`${serverUrl}/api/user/upload`, formData, {
            headers: { 
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (res.data && res.data.imageUrl) {
            console.log("✅ System: Upload successful. Image URL synchronized.");
            setAssistantImage(res.data.imageUrl); 
        }
    } catch (error) {
        console.error("❌ System: Image upload failed.", error.response?.data || error.message);
        alert("Image upload failed. Please verify server connection and try again.");
    }
};
  const handleNext = () => {
  if (!selectedRobot) return;

  // 🚀 FIXED: Pura path ya image object bhej rahe hain
  // Agar ye static image hai toh iska path jayega, agar upload hai toh blob URL
  navigate("/customize2", { state: { image: selectedRobot } }); 
  
};
  return (
    <div className='min-h-screen w-full bg-[#01010c] flex flex-col items-center py-10 md:py-16 px-4 overflow-x-hidden pb-40 text-white'>
      
      <button onClick={() => navigate("/")} className="fixed top-6 left-6 z-[60] group flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-full hover:bg-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-md">
        <IoArrowBackOutline className="text-2xl text-white group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all" />
        <span className="hidden md:block pr-2 text-sm font-bold uppercase tracking-widest text-white/70 group-hover:text-white">Home</span>
      </button>

      <div className="relative z-10 mb-12 md:mb-20 flex flex-col items-center text-center">
        <h1 className="relative flex flex-col items-center">
          <span className="text-[10px] font-black tracking-[0.8em] text-cyan-400 uppercase mb-4 animate-pulse">Digital Avatar</span>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-5xl md:text-7xl font-black text-white uppercase">Select</span>
            <span className="text-5xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300">Partner</span>
          </div>
        </h1>
      </div>
      
      <div className='relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-10 w-full max-w-[1400px] justify-items-center'>
        {staticRobots.map((roboImg, index) => (
          <div 
            key={index} 
            onMouseEnter={playHoverSound}
            className="w-full transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Card 
              image={roboImg} 
              isSelected={selectedRobot === roboImg} 
              onClick={() => setSelectedRobot(roboImg)} 
            />
          </div>
        ))}

       <div onMouseEnter={playHoverSound} className="w-full hover:scale-105 transition-all">
  <Card 
    isUpload={true} 
    image={assistantImage} // 👈 userImage ki jagah assistantImage
    hasCustomImage={!!assistantImage} // 👈 userImage ki jagah assistantImage
    onUpload={handleFileUpload}
    onDelete={() => { setAssistantImage(""); setSelectedRobot(null); }} // 👈 userImage ki jagah assistantImage
    isSelected={selectedRobot === assistantImage && assistantImage !== ""} // 👈 userImage ki jagah assistantImage
    onClick={() => assistantImage && setSelectedRobot(assistantImage)} // 👈 userImage ki jagah assistantImage
  />
</div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#01010c] to-transparent z-50 flex items-center justify-center px-6">
        <button 
          disabled={!selectedRobot}
          onClick={handleNext}
          className={`w-full max-w-[500px] h-[65px] font-black uppercase tracking-[0.3em] rounded-2xl text-xl transition-all duration-500 
            ${selectedRobot ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(34,211,238,0.4)] cursor-pointer' : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'}`}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default Customize;