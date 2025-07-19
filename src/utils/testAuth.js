// Testing utilities for authentication
// You can run these in the browser console

import { useAuthStore } from "../store/useAuthstore";
import { DEV_CONFIG } from "../config/dev.js";

// Make auth testing functions available globally for console access
window.authTest = {
  // Set mock authentication
  setMockAuth: () => {
    const setAuth = useAuthStore.getState().setAuth;
    setAuth(DEV_CONFIG.MOCK_USER.token, DEV_CONFIG.MOCK_USER.userId);
    console.log('✅ Mock authentication set');
    console.log('User ID:', DEV_CONFIG.MOCK_USER.userId);
  },

  // Clear authentication
  clearAuth: () => {
    const clearAuth = useAuthStore.getState().clearAuth;
    clearAuth();
    console.log('🗑️ Authentication cleared');
  },

  // Get current auth status
  getStatus: () => {
    const state = useAuthStore.getState();
    const status = {
      isLoggedIn: state.isLoggedIn,
      userId: state.userId,
      token: state.token ? '***' + state.token.slice(-4) : null,
      bypassEnabled: DEV_CONFIG.BYPASS_AUTH
    };
    console.log('🔍 Auth Status:', status);
    return status;
  },

  // Toggle bypass mode
  toggleBypass: () => {
    DEV_CONFIG.BYPASS_AUTH = !DEV_CONFIG.BYPASS_AUTH;
    console.log('🔄 Bypass mode:', DEV_CONFIG.BYPASS_AUTH ? 'ENABLED' : 'DISABLED');
    // Force re-render
    window.location.reload();
  },

  // Show all available commands
  help: () => {
    console.log(`
🔧 Authentication Testing Commands:

authTest.setMockAuth()     - Set mock authentication
authTest.clearAuth()       - Clear authentication
authTest.getStatus()       - Get current auth status
authTest.toggleBypass()    - Toggle bypass mode
authTest.help()           - Show this help

💡 Quick Test:
1. Run: authTest.setMockAuth()
2. Refresh page to see authenticated state
3. Run: authTest.getStatus() to check status
    `);
  }
};

// Auto-show help on load
console.log('🔧 Auth testing utilities loaded! Run authTest.help() for commands.'); 