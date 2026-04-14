import React, { useContext, useEffect, useState, useRef } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline, IoMicOutline, IoColorPaletteOutline, IoSend, IoVolumeHighOutline } from "react-icons/io5";
import { MdHistory } from "react-icons/md";
import axios from 'axios';

// Assets
import robo0 from "../assets/robo0.jpg"; import robo1 from "../assets/robo1.jpg";
import robo2 from "../assets/robo2.jpg"; import robo3 from "../assets/robo3.jpg";
import robo4 from "../assets/robo4.jpg"; import robo5 from "../assets/robo5.jpg";
import robo6 from "../assets/robo6.jpg"; import robo7 from "../assets/robo7.jpg";
import robo8 from "../assets/robo8.jpg"; import robo9 from "../assets/robo9.jpg";
import robo10 from "../assets/robo10.jpg"; import robo11 from "../assets/robo11.jpg";
import newrobo from "../assets/newrobo.jpg";

function Home() {
  const { userData, loading, handleCurrentUser, logout, serverUrl } = useContext(userDataContext);
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const hasGreeted = useRef(false);

  const avatarMap = {
    "robo0.jpg": robo0, "robo1.jpg": robo1, "robo2.jpg": robo2, "robo3.jpg": robo3,
    "robo4.jpg": robo4, "robo5.jpg": robo5, "robo6.jpg": robo6, "robo7.jpg": robo7,
    "robo8.jpg": robo8, "robo9.jpg": robo9, "robo10.jpg": robo10, "robo11.jpg": robo11,
    "newrobo.jpg": newrobo
  };

  const imgName = (userData?.assistantImage || "").toLowerCase();
  const isFemale = /(robo0|robo5|robo7|robo9|robo10|robo11|newrobo)/i.test(imgName);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const isHindi = /[\u0900-\u097F]/.test(text);
    const isMarathi = text.includes("आहे") || text.includes("काय") || text.includes("बघ");

    const selectedVoice = voices.find(v => {
      if (isFemale) {
        if (isHindi || isMarathi) return v.lang.includes("hi-IN");
        return v.lang.includes("en-US") && (v.name.includes("Zira") || v.name.includes("Female"));
      } else {
        if (isHindi || isMarathi) return v.lang.includes("hi-IN") && !v.name.includes("Google");
        return v.lang.includes("en-GB") || v.name.includes("David");
      }
    });

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = isMarathi ? "mr-IN" : isHindi ? "hi-IN" : "en-US";
    utterance.rate = 1.0;
    utterance.pitch = isFemale ? 1.1 : 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
useEffect(() => {
  if (userData?.name && !hasGreeted.current) {
    hasGreeted.current = true; // 👈 Isey setTimeout ke BAHAR pehle likh dein
    const firstName = userData.name.split(" ")[0];
    const greetingText = `Hello ${firstName}, your assistant ${userData.assistantName || "Shifra"} is online.`;
    
    setTimeout(() => {
      speak(greetingText);
    }, 1500);
  }
}, [userData]);
 
  const handleSendMessage = async (textFromVoice = null) => {
    const input = (textFromVoice || chatInput).trim();
    if (!input) return;

    setChatInput("");
    
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("play") || lowerInput.includes("youtube") || lowerInput.includes("search")) {
      let searchQuery = input.replace(/play|search|youtube|on youtube|karo/gi, "").trim();
      
      if (searchQuery) {
        speak(`Searching ${searchQuery} on YouTube`);
        setTimeout(() => {
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, "_blank");
        }, 1000);
      } else {
        speak("Opening YouTube");
        window.open("https://www.youtube.com", "_blank");
      }
    }

    try {
      const res = await axios.post(`${serverUrl}/api/user/asktoassistant`,
        { command: input },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      if (res.data.response) speak(res.data.response);
    } catch (err) {
      console.log("Backend error but local commands might work.");
    }
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Mic not supported");
    const rec = new SpeechRecognition();
    rec.lang = "en-IN"; 
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onresult = (e) => handleSendMessage(e.results[0][0].transcript);
    rec.start();
  };

useEffect(() => {
  const loadVoices = () => window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}, []);
  const getImg = () => {
    const imgName = userData?.assistantImage || "robo5.jpg";
    if (imgName.startsWith("http")) return imgName;
    const key = imgName.includes('.') ? imgName : `${imgName}.jpg`;
    return avatarMap[key] || robo5;
  };

  if (loading) return null;

  return (
    <div className="min-h-screen w-full bg-[#02020a] flex flex-col items-center text-white p-4 relative overflow-hidden font-sans">
      <style>{`
        @keyframes facialReaction {
          0% { transform: scale(1); filter: brightness(1) saturate(1); }
          50% { transform: scale(1.04); filter: brightness(1.2) saturate(1.2); }
          100% { transform: scale(1); filter: brightness(1) saturate(1); }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.2); border-color: rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 60px rgba(34, 211, 238, 0.6); border-color: #22d3ee; }
          100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.2); border-color: rgba(255,255,255,0.1); }
        }
        .ai-talking-img { animation: facialReaction 0.4s infinite ease-in-out; }
        .ai-talking-container { animation: glowPulse 1.5s infinite ease-in-out; }
        .ai-listening-container { border-color: #ef4444 !important; box-shadow: 0 0 40px rgba(239, 68, 68, 0.6) !important; }
        .glass-ui { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }
      `}</style>

      {/* Header */}
      <div className="w-full flex justify-between items-center z-20 px-4 md:px-10 py-4 text-white">
        <button onClick={() => navigate("/history")} className="p-3 glass-ui rounded-2xl text-cyan-400 hover:scale-110 transition-all"><MdHistory size={26}/></button>
        <div className="flex gap-4">
          <button onClick={() => navigate("/customize")} className="flex items-center gap-2 px-6 py-2 glass-ui rounded-full text-xs font-bold tracking-widest hover:border-cyan-500 transition-all uppercase">
            <IoColorPaletteOutline size={20}/> Customize
          </button>
          <button onClick={logout} className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><IoLogOutOutline size={26}/></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 max-w-4xl px-4">
       
        <h1 className={`text-6xl md:text-9xl font-black mb-16 tracking-tighter transition-all duration-1000 text-center ${isSpeaking ? 'text-cyan-400 opacity-100 scale-105' : 'text-white/5'}`}>
          {userData?.assistantName?.toUpperCase() || "SHIFRA"}
        </h1>

        <div className="relative cursor-pointer mb-20" onClick={startRecognition}>
          <div className={`w-64 h-64 md:w-[480px] md:h-[480px] rounded-full border-4 overflow-hidden bg-[#050505] flex items-center justify-center transition-all duration-500 
            ${isListening ? 'ai-listening-container' : isSpeaking ? 'ai-talking-container' : 'border-white/10'}`}>
            <img 
              src={getImg()} 
              alt="AI Avatar" 
              className={`w-full h-full object-cover object-top transition-all duration-500 
              ${isSpeaking ? 'ai-talking-img scale-110 contrast-125' : 'scale-100 grayscale-[20%]'}`} 
            />
          </div>
          <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 p-7 rounded-full z-30 shadow-2xl transition-all duration-300
            ${isListening ? 'bg-red-600 scale-125 animate-pulse' : 'bg-cyan-500 text-black hover:scale-110'}`}>
            <IoMicOutline size={45} />
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
                className="flex items-center glass-ui rounded-[2.5rem] p-2 focus-within:ring-2 ring-cyan-500/50 transition-all shadow-2xl">
            <input 
              type="text" 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Talk to ${userData?.assistantName || "Assistant"}...`} 
              className="flex-1 bg-transparent py-5 px-8 outline-none text-white text-lg placeholder:text-white/20"
            />
            <button type="submit" className={`p-5 rounded-full transition-all ${chatInput ? 'text-cyan-400' : 'text-white/10'}`}>
              <IoSend size={30} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;