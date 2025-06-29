import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthstore';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { WP_URL } from '../compnents/constant';
import { useLanguageStore } from '../store/useLanguageStore'; 
import { LoginTranslations } from '../compnents/constant';   // ✅ import translations

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
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 space-y-6 border border-blue-500 rounded-lg shadow-sm">
        <h2 className="text-center text-3xl font-extrabold text-blue-600">
          {t.welcome}
        </h2>
        {isLoggedIn ? (
          <div className="text-center space-y-4">
            <p className="text-blue-700">{t.loggedIn} (User ID: {userId})</p>
            <button onClick={handleLogout} className="w-full py-2 px-4 rounded-md bg-blue-600 text-white">
              {t.logout}
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full px-3 py-2 border border-blue-300 rounded-t-md"
                placeholder={t.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-3 py-2 border border-blue-300 rounded-b-md"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-blue-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md bg-blue-600 text-white"
            >
              {loading ? t.loggingIn : t.signIn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
