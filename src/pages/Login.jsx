import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthstore';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { WP_URL } from '../compnents/constant';
import { useLanguageStore } from '../store/useLanguageStore'; 
import { LoginTranslations } from '../compnents/constant';   // ✅ import translations
import { FaUser, FaLock, FaCheckCircle, FaExclamationCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { showError, showSuccess } from '../utils/toast.jsx';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userId = useAuthStore((state) => state.userId);

  const language = useLanguageStore((state) => state.language); // ✅ get current lang
  const t = LoginTranslations[language]; // ✅ t shortcut

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${WP_URL}/wp-json/custom/v1/login/`, {
        username,
        password,
      });

      const data = response.data;
      setAuth(data.token, data.user_id);
      showSuccess(t.loggedIn);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      showError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    showSuccess(t.logout);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-gray-100 p-4 animate-fade-in-up">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-center">
            {/* <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse-slow">
              <FaSignInAlt className="text-red-600 text-3xl" />
            </div> */}
            <h2 className="text-2xl font-bold text-white ">
              {t.welcome}
            </h2>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {isLoggedIn ? (
              <div className="text-center space-y-6 animate-fade-in-up">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center">
                  <FaCheckCircle className="text-green-600 text-2xl mb-2 animate-pulse-slow" />
                  <span className="text-green-700 font-medium">{t.loggedIn}</span>
                  <p className="text-sm text-gray-600">User ID: {userId}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt /> {t.logout}
                </button>
              </div>
            ) : (
              <form className="space-y-6 animate-fade-in-up" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder={t.username}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder={t.password}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 animate-fade-in-up">
                    <FaExclamationCircle className="text-red-600 text-xl" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transform hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2"><FaSignInAlt /></span>
                      {t.loggingIn}
                    </>
                  ) : (
                    <>
                      <FaSignInAlt /> {t.signIn}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
