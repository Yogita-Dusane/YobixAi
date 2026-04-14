import React, { useState, useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5";
import axios from 'axios';

// --- ALL ASSETS ---
import robo0 from "../assets/robo0.jpg";
import robo1 from "../assets/robo1.jpg";
import robo2 from "../assets/robo2.jpg";
import robo3 from "../assets/robo3.jpg";
import robo4 from "../assets/robo4.jpg";
import robo5 from "../assets/robo5.jpg";
import robo6 from "../assets/robo6.jpg";
import robo7 from "../assets/robo7.jpg";
import robo8 from "../assets/robo8.jpg";
import robo9 from "../assets/robo9.jpg";
import robo10 from "../assets/robo10.jpg";
import robo11 from "../assets/robo11.jpg";
import newrobo from "../assets/newrobo.jpg";

function Customize2() {
  const { serverUrl, handleCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const passedImage = location.state?.image || "robo1.jpg";
  const [assistantName, setAssistantName] = useState("");
  const [loading, setLoading] = useState(false);

  const robotMap = { 
    "robo0.jpg": robo0, "robo1.jpg": robo1, "robo2.jpg": robo2, "robo3.jpg": robo3, 
    "robo4.jpg": robo4, "robo5.jpg": robo5, "robo6.jpg": robo6, "robo7.jpg": robo7, 
    "robo8.jpg": robo8, "robo9.jpg": robo9, "robo10.jpg": robo10, "robo11.jpg": robo11, 
    "newrobo.jpg": newrobo 
  };

  const getDisplayImage = () => {
    if (!passedImage) return robo1;
    if (typeof passedImage === 'string' && (passedImage.startsWith("http") || passedImage.startsWith("blob"))) return passedImage;
    const fileName = String(passedImage).split('/').pop().split('.')[0].split('-')[0];
    const key = `${fileName}.jpg`;
    return robotMap[key] || robotMap[passedImage] || robo1;
  };

 // Customize2.jsx ke andar handleFinalize function mein ye change karo:

const handleFinalize = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    // LOGIC: Check karo ki passedImage URL hai ya local file name
    let nameForDb;
    
    if (typeof passedImage === 'string' && (passedImage.startsWith("http") || passedImage.startsWith("blob"))) {
      // Agar gallery se aayi hai, toh pura URL save karo
      nameForDb = passedImage; 
    } else {
      // Agar static robo hai, toh sirf uska clean name save karo (e.g., robo1.jpg)
      const fileName = String(passedImage).split('/').pop().split('.')[0].split('-')[0];
      nameForDb = `${fileName}.jpg`;
    }

    await axios.post(`${serverUrl}/api/user/update-assistant`, 
      { 
        assistantName: assistantName.toUpperCase(), 
        assistantImage: nameForDb 
      }, 
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    await handleCurrentUser(); 
    navigate("/home");
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
       
  return (
    <div className="min-h-screen w-full bg-[#02020a] flex flex-col items-center justify-center p-4 sm:p-10 text-white relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent -z-10" />

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-6 left-6 flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-full hover:bg-cyan-500/30 transition-all z-50 group backdrop-blur-xl"
      >
        <IoArrowBackOutline className="group-hover:-translate-x-1 transition-transform" size={20}/>
        <span className="text-xs font-black uppercase tracking-widest">Back</span>
      </button>

      <div className="w-full max-w-2xl flex flex-col items-center z-10 text-center">
        
        {/* Title Updated */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-10 tracking-tighter uppercase italic leading-tight">
          GIVE NAME TO YOUR <br/> <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">ASSISTANT</span>
        </h1>

        {/* Face Focus Circle */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#05050a] border-4 border-[#02020a]">
                <img 
                  src={getDisplayImage()} 
                  alt="Assistant Preview" 
                  className="w-full h-full object-cover object-top rounded-full" 
                />
            </div>
          </div>
        </div>

        {/* Input Form with Darker/Better Box */}
        <div className="w-full max-w-md space-y-6 px-4">
          <div className="relative">
            {/* Proper Input Box Design */}
            <div className="bg-white/10 border-2 border-white/20 rounded-2xl p-2 focus-within:border-cyan-400 focus-within:bg-white/15 transition-all shadow-2xl">
              <input 
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="e.g. SHIFRA" 
                  // Placeholder is now much brighter (white/40 instead of white/5)
                  className="w-full bg-transparent py-4 md:py-5 text-3xl md:text-4xl font-black text-center placeholder:text-white/40 text-white outline-none uppercase tracking-widest"
              />
            </div>
            <p className="mt-3 text-[10px] font-bold text-cyan-400/60 tracking-[0.3em] uppercase">Enter name</p>
          </div>

          <button 
              onClick={handleFinalize}
              disabled={loading || !assistantName}
              className={`w-full py-5 md:py-6 rounded-2xl font-black text-xl md:text-2xl uppercase tracking-[0.4em] transition-all duration-300 shadow-2xl
                ${loading || !assistantName 
                  ? 'bg-white/5 text-white/10 cursor-not-allowed' 
                  : 'bg-cyan-500 text-black hover:bg-white hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {loading ? "INITIALIZING..." : "CREATE ASSISTANT"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Customize2;