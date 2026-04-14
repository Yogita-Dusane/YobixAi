import React, { useEffect, useState, useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline, IoChatbubbleEllipsesOutline, IoTimeOutline, IoTrashOutline, IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import axios from 'axios';

function History() {
  const { serverUrl, loading } = useContext(userDataContext);
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/history`, {
        headers: { "x-auth-token": localStorage.getItem("token") }
      });
      setHistory(res.data);
    } catch (err) {
      console.log("Error fetching history", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (serverUrl) fetchHistory();
  }, [serverUrl]);

  // --- DELETE ALL LOGIC ---
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to clear ALL chat history? This cannot be undone.")) return;
    try {
      const allIds = history.map(item => item._id);
      await axios.post(`${serverUrl}/api/user/delete-history`, { ids: allIds }, {
        headers: { "x-auth-token": localStorage.getItem("token") }
      });
      setHistory([]);
    } catch (err) {
      alert("Failed to clear history");
    }
  };

  const handleDeleteOne = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await axios.post(`${serverUrl}/api/user/delete-history`, { ids: [id] }, {
        headers: { "x-auth-token": localStorage.getItem("token") }
      });
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Error deleting chat");
    }
  };

  // --- SEARCH FILTER ---
  const filteredHistory = history.filter(item => 
    item.command.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || fetching) return (
    <div className="min-h-screen bg-[#02020a] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#02020a] text-white p-4 md:p-10 font-sans relative">
      
      {/* Top Header Section */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <button onClick={() => navigate("/home")} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">
          <IoArrowBackOutline size={24}/>
        </button>
        
        <h1 className="hidden md:flex text-3xl font-black tracking-tighter items-center gap-3">
          <IoTimeOutline className="text-cyan-400" />
          CHAT <span className="text-cyan-400">HISTORY</span>
        </h1>

        {/* Delete All Button */}
        {history.length > 0 && (
          <button 
            onClick={handleDeleteAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
          >
            <IoTrashOutline size={20} />
            <span className="hidden sm:inline">CLEAR ALL</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="relative group">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search your conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all text-lg"
          />
        </div>
      </div>

      {/* History List */}
      <div className="max-w-4xl mx-auto space-y-4 pb-20">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div 
              key={item._id} 
              onClick={() => setSelectedChat(item)}
              className="group p-5 bg-white/[0.03] border border-white/10 rounded-3xl hover:border-cyan-500/50 transition-all cursor-pointer relative overflow-hidden"
            >
              <button 
                onClick={(e) => handleDeleteOne(e, item._id)}
                className="absolute top-5 right-5 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
              >
                <IoTrashOutline size={18} />
              </button>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 shrink-0">
                  <IoChatbubbleEllipsesOutline size={24} />
                </div>
                <div className="flex-1 pr-10">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-black mb-1">Conversation</p>
                  <p className="text-lg text-white/90 font-medium truncate">
                    {item.command}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 opacity-20">
            <IoSearchOutline size={60} className="mx-auto mb-4" />
            <p className="text-xl font-bold">No matching chats found.</p>
          </div>
        )}
      </div>

      {/* --- MODAL (Same as before) --- */}
      {selectedChat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedChat(null)}></div>
          <div className="relative w-full max-w-2xl bg-[#0a0a12] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-black text-cyan-400 tracking-tight uppercase">Message Log</h2>
              <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><IoCloseOutline size={28} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase mb-2">You</p>
                <div className="bg-cyan-500/10 p-5 rounded-3xl rounded-tl-none border border-cyan-500/20">
                  <p className="text-xl text-white/90">{selectedChat.command}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-cyan-500/40 uppercase mb-2">AI Response</p>
                <div className="bg-white/5 p-5 rounded-3xl rounded-tr-none border border-white/10">
                  <p className="text-xl text-white/70 italic leading-relaxed">"{selectedChat.response}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;