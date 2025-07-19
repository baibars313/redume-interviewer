// Development configuration for testing
export const DEV_CONFIG = {
  // Set to false to bypass authentication for testing
  BYPASS_AUTH: false,
  
  // Mock user data for testing
  MOCK_USER: {
    userId: 'test-user-123',
    token: 'mock-token-for-testing',
    isLoggedIn: false
  },
  
  // API endpoints
  API_URL: 'http://localhost:8000',
  
  // Debug mode
  DEBUG: false
};

// Helper function to check if we're in development mode
export const isDevelopment = () => {
  return import.meta.env.DEV || import.meta.env.VITE_BYPASS_AUTH === 'false';
}; 