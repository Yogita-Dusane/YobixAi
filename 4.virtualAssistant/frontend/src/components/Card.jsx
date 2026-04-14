import React, { useRef, useState, useEffect } from 'react';
import hoverSfx from "../assets/hover.mp3"; 

function Card({ image, isUpload, onUpload, isSelected, onClick, onDelete, hasCustomImage }) {
  const [showMenu, setShowMenu] = useState(false);
  const audioRef = useRef(new Audio(hoverSfx));
  const menuRef = useRef(null);

  const playHoverSound = () => {
    const sound = audioRef.current;
    sound.volume = 0.1;
    sound.currentTime = 0; 
    sound.play().catch(() => {});
  };

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. EMPTY UPLOAD SLOT
  if (isUpload && !hasCustomImage) {
    return (
      <label 
        onMouseEnter={playHoverSound}
        className="group relative w-[160px] h-[240px] sm:w-[210px] sm:h-[300px] 
                   bg-[#030326]/50 border-2 border-dashed border-cyan-500/30 rounded-2xl 
                   flex flex-col items-center justify-center cursor-pointer
                   transition-all duration-500 hover:border-cyan-400 hover:bg-cyan-500/10"
      >
        <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
        <div className="text-4xl text-cyan-400 group-hover:scale-125 transition-transform">+</div>
        <p className="text-white text-[10px] font-black mt-2 tracking-[3px] uppercase">Gallery</p>
      </label>
    );
  }

  return (
    <div 
      onMouseEnter={playHoverSound}
      onClick={onClick}
      className={`group relative w-[160px] h-[240px] sm:w-[210px] sm:h-[300px] 
                 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer
                 ${isSelected 
                   ? 'border-4 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.5)] scale-105 z-20' 
                   : 'border-2 border-white/5 hover:border-blue-500/50'}`}
    >
      <img 
        src={image} 
        className={`w-full h-full object-cover object-top transition-all duration-700 
                   ${isSelected ? 'brightness-110' : 'brightness-75 group-hover:brightness-100'}`} 
      />

      {/* THREE DOTS MENU (Only for Gallery Image) */}
      {hasCustomImage && image === hasCustomImage && (
        <div className="absolute top-3 right-3 z-50" ref={menuRef}>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
          >
            ⋮
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-28 bg-[#0a0a20] border border-white/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <label className="block w-full px-4 py-2 text-[10px] font-bold text-blue-400 hover:bg-white/10 cursor-pointer text-center border-b border-white/5">
                CHANGE
                <input type="file" className="hidden" onChange={(e) => { onUpload(e); setShowMenu(false); }} />
              </label>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); setShowMenu(false); }}
                className="w-full px-4 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/20 text-center"
              >
                DELETE
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Label */}
      <div className={`absolute bottom-0 w-full py-3 backdrop-blur-md transition-all duration-300
                      ${isSelected ? 'bg-cyan-400 translate-y-0' : 'bg-white/5 translate-y-full group-hover:translate-y-0'}`}>
        <p className={`text-[10px] text-center font-black tracking-[3px] ${isSelected ? 'text-black' : 'text-white'}`}>
          {isSelected ? 'ACTIVE' : 'SELECT'}
        </p>
      </div>
    </div>
  );
}

export default Card;