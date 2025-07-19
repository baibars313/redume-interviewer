import { Toaster } from "react-hot-toast";
import StepperCard from "./compnents/StepperCard";
import SessionTable from "./pages/Sessions";
import SessionDetails from "./pages/SessionDetails";
import { Route, Routes } from "react-router";
import Navbar from "./compnents/Navbar";
import DrivingStepperCard from "./compnents/DrivingCard";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/Login";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 relative overflow-x-hidden">
      {/* AI-inspired animated background */}
      <div className="pointer-events-none select-none absolute inset-0 z-0">
        <svg width="100%" height="100%" className="absolute inset-0 animate-fade-in-up" style={{opacity:0.08}}>
          <defs>
            <radialGradient id="aiGlow" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#fc1566" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="60%" cy="40%" r="400" fill="url(#aiGlow)" />
          <circle cx="20%" cy="80%" r="250" fill="url(#aiGlow)" />
        </svg>
      </div>
      <Navbar />
      <main className="min-h-[calc(100vh-80px)] relative z-10">
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<StepperCard />} />
            <Route path="/driving" element={<DrivingStepperCard />} />
            <Route path="/sessions" element={<SessionTable />} />
            <Route path="/sessiondetails" element={<SessionDetails />} />
          </Route>
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255,255,255,0.95)',
            color: '#fc1566',
            border: '1px solid #fc1566',
            boxShadow: '0 8px 32px 0 rgba(252,21,102,0.12)',
            fontWeight: 500,
            fontSize: '1rem',
            borderRadius: '1rem',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
