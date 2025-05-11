
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthstore";


function PrivateRoute() {
  
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    console.log(isLoggedIn)

    return isLoggedIn ? <Outlet/> : <Navigate to="/login" replace />;
  }

export default PrivateRoute;
  