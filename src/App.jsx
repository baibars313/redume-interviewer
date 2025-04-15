import { Toaster } from "react-hot-toast";
import StepperCard from "./compnents/StepperCard";
import SessionTable from "./pages/Sessions";
import SessionDetails from "./pages/SessionDetails";
import { Route, Routes } from "react-router";
import Navbar from "./compnents/Navbar";
import DrivingStepperCard from "./compnents/DrivingCard";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<StepperCard />} />
        <Route path="/driving" element={<DrivingStepperCard />} />
        <Route path="/sessions" element={<SessionTable />} />
        <Route path="/sessiondetails" element={<SessionDetails />} />
      </Routes>
      <Toaster />
    </div>
  );
}
