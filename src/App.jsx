import { Toaster } from "react-hot-toast";
import StepperCard from "./compnents/StepperCard";
import SessionTable from "./pages/Sessions";
import { Route, Routes } from "react-router";
import Navbar from "./compnents/Navbar";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<StepperCard />} />
        <Route path="/driving" element={<StepperCard />} />

        <Route path="/sessions" element={<SessionTable />} />
      </Routes>
    </div>
  );
}
