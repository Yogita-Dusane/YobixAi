import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoLogoAppleAppstore, IoImageOutline, IoCloudUploadOutline,
  IoMailOutline, IoArrowForward 
} from "react-icons/io5";

const images = ["/hand.jpg", "/koko.jpg", "/human.jpg"];

const LandingPage = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  // Auto-slide FAST to avoid any lag/white space
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds interval
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen text-black bg-white font-sans selection:bg-cyan-100 relative overflow-x-hidden">
      
      {/* --- 1. SMOOTH BACKGROUND SLIDER (Optimized for No Blinking) --- */}
      <div className="fixed inset-0 z-0 bg-black">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={images[index]}
            src={images[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "linear" }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="background"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white"></div>
      </div>

      {/* --- 2. NAVBAR (Zoomed Logo Left + Premium Login) --- */}
      <nav className="relative z-50 flex justify-between items-center px-4 md:px-10 h-24 bg-violet-950/90 backdrop-blur-md shadow-2xl text-white">
        <div className="flex items-center gap-4 ml-0 md:-ml-2">
          {/* Zoomed Logo without cutting */}
          <div className="overflow-visible">
            <img 
              src="/new.png" 
              alt="Logo" 
              className="h-14 md:h-16 w-auto object-contain transform scale-150 transition-transform duration-300" 
            />
          </div>
          <div className="flex flex-col ml-4">
            <span className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
              Yobix <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Virtual Assistant</span>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/signin')} 
          className="px-8 py-3 bg-cyan-400 text-black text-sm font-black rounded-full uppercase shadow-lg transition-all border-2 border-transparent hover:border-cyan-400"
        >
          Login
        </motion.button>
      </nav>

 {/* --- 3. HERO SECTION (Medium & High Visibility) --- */}
<header className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="space-y-6"
  >
<h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-violet-950">
  <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">Yobix</span> 
  <span className="text-cyan-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] ml-3">Ai</span> 
  <br /> 
  {/* YE WALA TRY KARO */}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-4xl md:text-7xl block mt-4 drop-shadow-lg">
    Virtual Assistant
  </span>
</h1>
    <p className="max-w-2xl text-slate-900 text-lg md:text-xl font-extrabold mx-auto leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
      Smart, fast, and simple virtual assistance for everyone. <br />
      Experience the future of AI interaction.
    </p>

    {/* Button: Perfectly Sized */}
    <motion.button 
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(34, 211, 238, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/signup')} 
      className="mt-6 px-10 py-5 bg-violet-950 text-white rounded-[1.5rem] font-black text-lg flex items-center gap-3 mx-auto shadow-2xl hover:bg-violet-900 transition-all border border-white/10"
    >
      GET STARTED <IoArrowForward size={24}/>
    </motion.button>
  </motion.div>
</header>
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-[3rem] p-10 md:p-20 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-center mb-16 text-violet-950 tracking-tighter">Next Level Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <IoLogoAppleAppstore />, title: "Mobile App", desc: "Carry Yobix AI in your pocket, everywhere." },
              { icon: <IoImageOutline />, title: "Vision AI", desc: "Generate high-quality images in seconds." },
              { icon: <IoCloudUploadOutline />, title: "Smart Sync", desc: "Upload and analyze your data instantly." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -15 }}
                className="p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 text-center hover:shadow-2xl transition-all"
              >
                <div className="text-6xl text-cyan-600 mb-6 flex justify-center transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-black uppercase text-violet-950">{item.title}</h3>
                <p className="text-slate-500 text-sm font-semibold mt-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. FOUNDER SECTION --- */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 bg-slate-50 rounded-[4rem] my-20 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-16 px-6">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black uppercase text-violet-950">The <span className="text-cyan-600">Founder</span></h2>
            <p className="text-slate-700 text-xl font-medium leading-relaxed italic">
              "Yobix AI is my vision of a future where AI feels like a friend, not a tool."
            </p>
            <p className="text-2xl font-black text-violet-900 tracking-widest uppercase">— Yogita Dusane</p>
          </div>
          <div className="flex-1 flex justify-center">
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative group p-4 bg-white rounded-[4rem] shadow-2xl"
            >
              <div className="absolute -inset-2 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-[4.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img 
                src="/yogita.jpeg" 
                className="relative w-72 h-72 md:w-80 md:h-80 object-cover rounded-[3.5rem]" 
                alt="Yogita Dusane" 
                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/6073/6073873.png"}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 6. FOOTER --- */}
      <footer className="relative z-10 py-16 bg-violet-950 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          
          <div className="flex items-center gap-4">
            <img src="/new.png" alt="Footer Logo" className="h-16 w-auto scale-125" />
            <div className="text-left">
              <p className="font-black text-xl uppercase text-cyan-400">Yobix AI</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Innovation Simplified</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full">
            <IoMailOutline className="text-cyan-400 text-2xl" />
            <span className="text-sm md:text-lg font-bold tracking-tight">yogitadusane2601@gmail.com</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-white/40 uppercase font-bold mb-1">Developed By</p>
            <p className="text-2xl font-black uppercase text-white">Yogita Dusane</p>
            <p className="text-[10px] text-white/20 mt-2 uppercase">© 2026 All Rights Reserved</p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;