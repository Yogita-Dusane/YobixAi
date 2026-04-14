import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { userDataContext } from './context/UserContext' 
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import Customize2 from './pages/Customize2'
import History from './pages/History';
function App() {
  const { userData, loading } = useContext(userDataContext);

  if (loading) return (
    <div className="min-h-screen bg-[#02020a] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      
      {/* Protected Routes (Sirf check karo login hai ya nahi) */}
      <Route path='/home' element={userData ? <Home /> : <Navigate to="/signin" replace />} />
      <Route path='/customize' element={userData ? <Customize /> : <Navigate to="/signin" replace />} />
      <Route path='/customize2' element={userData ? <Customize2 /> : <Navigate to="/signin" replace />} />
      <Route path='/history' element={userData ? <History /> : <Navigate to="/signin" replace />} />

      <Route path='*' element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;