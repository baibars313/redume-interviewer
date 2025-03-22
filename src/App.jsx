import { Toaster } from "react-hot-toast";
import StepperCard from "./compnents/StepperCard";
import SessionTable from "./pages/Sessions";
import { Route, Routes } from "react-router";
import Navbar from "./compnents/Navbar";
import SessionSummary from "./compnents/Details";
import DrivingStepperCard from "./compnents/DrivingCard";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<StepperCard />} />
        <Route path="/driving" element={<DrivingStepperCard />} />

        <Route path="/sessions" element={<SessionTable />} />
        
        <Route path="/details" element={<SessionSummary/>} />
      </Routes>
    </div>
  );
}
