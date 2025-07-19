import { useAuthStore } from "../store/useAuthstore";
import { DEV_CONFIG } from "../config/dev.js";

// Helper function to set mock authentication for testing
export const setMockAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  setAuth(DEV_CONFIG.MOCK_USER.token, DEV_CONFIG.MOCK_USER.userId);
  console.log('🔑 Mock authentication set for testing');
};

// Helper function to clear authentication
export const clearMockAuth = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  clearAuth();
  console.log('🗑️ Authentication cleared');
};

// Helper function to check if we're in testing mode
export const isTestMode = () => {
  return DEV_CONFIG.BYPASS_AUTH || import.meta.env.DEV;
};

// Helper function to get current auth status
export const getAuthStatus = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  
  return {
    isLoggedIn,
    userId,
    token: token ? '***' + token.slice(-4) : null,
    isTestMode: isTestMode()
  };
};

// Debug function to log auth status
export const debugAuth = () => {
  const status = getAuthStatus();
  console.log('🔍 Auth Debug Info:', status);
  return status;
}; 