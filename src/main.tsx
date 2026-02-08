import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./context/AuthContext/AuthContext.tsx";
import { Toaster } from 'react-hot-toast';
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
     <Toaster
      position="top-right" 
  reverseOrder={false} 
  toastOptions={{
    duration: 4000, 
  }} />
  </StrictMode>,
);
