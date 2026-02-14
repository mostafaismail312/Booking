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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

//const stripePromise = loadStripe("pk_test_51OTjURBQWp069pqTmqhKZHNNd3kMf9TTynJtLJQIJDOSYcGM7xz3DabzCzE7bTxvuYMY0IX96OHBjsysHEKIrwCK006Mu7mKw8");



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
   <Elements stripe={stripePromise}>
  <App />
</Elements>
    </AuthProvider>
     <Toaster
      position="top-right" 
  reverseOrder={false} 
  toastOptions={{
    duration: 4000, 
  }} />
  </StrictMode>,
);
