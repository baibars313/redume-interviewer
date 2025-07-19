# 🔓 Authentication Testing Guide

## Quick Start

### Method 1: Automatic Bypass (Recommended)
The authentication is automatically bypassed in development mode. Just run your app and you'll have access to all protected routes.

### Method 2: Browser Console Commands
Open your browser's developer console and use these commands:

```javascript
// Set mock authentication
authTest.setMockAuth()

// Check current status
authTest.getStatus()

// Clear authentication
authTest.clearAuth()

// Toggle bypass mode
authTest.toggleBypass()

// Show all available commands
authTest.help()
```

### Method 3: Configuration File
Edit `src/config/dev.js` and set:
```javascript
BYPASS_AUTH: true  // or false to enable authentication
```

## Testing Scenarios

### 1. Test Authenticated State
```javascript
authTest.setMockAuth()
// Refresh page to see authenticated UI
```

### 2. Test Unauthenticated State
```javascript
authTest.clearAuth()
// Refresh page to see login page
```

### 3. Test Bypass Mode
```javascript
authTest.toggleBypass()
// This will reload the page with bypass enabled/disabled
```

## Environment Variables

You can also use environment variables:
```bash
# Create a .env file in your project root
VITE_BYPASS_AUTH=true
```

## Debug Information

The console will show helpful debug information:
- 🔐 Authentication status
- 🔓 Bypass mode status
- 📝 Instructions for disabling bypass

## Re-enabling Authentication

To re-enable authentication:
1. Set `BYPASS_AUTH: false` in `src/config/dev.js`
2. Or set `VITE_BYPASS_AUTH=false` in your `.env` file
3. Or run `authTest.toggleBypass()` in the console

## Notes

- Authentication bypass only works in development mode
- Production builds will always require authentication
- Mock user ID: `test-user-123`
- Mock token: `mock-token-for-testing` 