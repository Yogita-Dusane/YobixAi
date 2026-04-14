import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' // <--- Aapne sirf createRoot mangwaya hai
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { UserDataProvider } from './context/UserContext'; 
import axios from 'axios';

// Browser settings for cookies
axios.defaults.withCredentials = true; 

// FIX: Yahan 'ReactDOM.createRoot' ki jagah sirf 'createRoot' hoga
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserDataProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserDataProvider>
  </StrictMode>
);