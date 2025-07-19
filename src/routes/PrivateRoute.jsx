
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthstore";
import { DEV_CONFIG, isDevelopment } from "../config/dev.js";


function PrivateRoute() {
  
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    console.log('🔐 Authentication status:', isLoggedIn);

    // Development bypass - multiple ways to enable
    const bypassAuth = isDevelopment() || DEV_CONFIG.BYPASS_AUTH;
    
    if (bypassAuth) {
      console.log('🔓 Authentication bypassed for testing');
      console.log('📝 To disable bypass, set BYPASS_AUTH: false in src/config/dev.js');
      return <Outlet/>;
    }

    // Normal authentication flow
    return isLoggedIn ? <Outlet/> : <Navigate to="/login" replace />;
  }

export default PrivateRoute;
  