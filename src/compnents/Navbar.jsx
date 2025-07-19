// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import LanguageSelector from './LanguageSelector';
import { useLanguageStore } from '../store/useLanguageStore';
import { LoginTranslations, NavbarTranslations } from './constant';
import { useAuthStore } from '../store/useAuthstore';
import { FaSignOutAlt, FaSignInAlt, FaHome, FaRobot, FaBars, FaTimes, FaListUl } from 'react-icons/fa';

export default function Navbar() {
  const language = useLanguageStore((state) => state.language);
  const t = NavbarTranslations[language]; // translation shortcut
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const t2 = LoginTranslations[language]; // ✅ t shortcut
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: t.home, icon: <FaHome className="inline mr-2" /> },
    { path: '/sessions', label: t.sessions, icon: <FaListUl className="inline mr-2" /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#0f1a37] to-[#1a2a4a] border-b-2 border-red-400 shadow-xl sticky top-0 z-50 animate-fade-in-up">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className='flex justify-start items-center gap-2'>
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
            <FaRobot className="text-red-500 text-2xl animate-pulse-slow" />
            <img 
              src="https://www.hubinterview.com/wp-content/uploads/2022/03/cropped-art_by_adam_vector-02-01.png" 
              className="h-8 transition-transform duration-300 group-hover:scale-110" 
              alt="Logo" 
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden inline-flex items-center p-2 w-10 h-10 text-sm text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
        >
          {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="font-medium flex justify-end gap-6 p-2 md:p-0">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`block py-2 px-4 text-white rounded-lg transition-all duration-300 hover:bg-red-600 hover:shadow-lg flex items-center gap-2 ${
                    isActive(item.path) 
                      ? 'bg-red-600 shadow-lg' 
                      : 'hover:scale-105'
                  }`}
                >
                  {item.icon}{item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="block py-2 px-4 text-white rounded-lg transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:scale-105 flex items-center gap-2"
              >
                {isLoggedIn ? <FaSignOutAlt className="mr-1" /> : <FaSignInAlt className="mr-1" />}
                {isLoggedIn ? t2.logout : t2.login}
              </button>
            </li>
            <li>
              <div className="block py-2 px-4 text-white rounded-lg">
                <LanguageSelector />
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0f1a37] border-t border-red-400 animate-slide-in-right">
          <ul className="font-medium p-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 px-4 text-white rounded-lg transition-colors flex items-center gap-2 ${
                    isActive(item.path) ? 'bg-red-600' : 'hover:bg-red-600'
                  }`}
                >
                  {item.icon}{item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                {isLoggedIn ? <FaSignOutAlt className="mr-1" /> : <FaSignInAlt className="mr-1" />}
                {isLoggedIn ? t2.logout : t2.login}
              </button>
            </li>
            <li>
              <div className="block py-2 px-4 text-white rounded-lg">
                <LanguageSelector />
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
