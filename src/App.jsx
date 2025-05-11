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
    <div>
      <Navbar />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<StepperCard />} />
          <Route path="/driving" element={<DrivingStepperCard />} />
          <Route path="/sessions" element={<SessionTable />} />
          <Route path="/sessiondetails" element={<SessionDetails />} />
        </Route>
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
      <Toaster />
    </div>
  );
}
