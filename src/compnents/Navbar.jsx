// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router';
import LanguageSelector from './LanguageSelector';
import { useLanguageStore } from '../store/useLanguageStore';
import { LoginTranslations, NavbarTranslations } from './constant';
import { useAuthStore } from '../store/useAuthstore';

export default function Navbar() {
  const language = useLanguageStore((state) => state.language);
  const t = NavbarTranslations[language]; // translation shortcut
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
   const t2 = LoginTranslations[language]; // ✅ t shortcut
   const clearAuth = useAuthStore((state) => state.clearAuth);
   const navigate = useNavigate();
   const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };
  return (
    <nav className="bg-[#0f1a37] border-red-400 border-b-2 shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className='flex justify-start'>
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://www.hubinterview.com/wp-content/uploads/2022/03/cropped-art_by_adam_vector-02-01.png" className="h-8" alt="Logo" />
          </Link>
         
        </div>

        <div>
          <ul className="font-medium flex justify-end gap-6 p-2 md:p-0 mt-4">
            <li>
              <Link to="/" className="block py-2 px-3 text-white rounded-sm md:border-0 md:p-0">
                {t.home}
              </Link>
            </li>
            <li>
              <Link to="/sessions" className="block py-2 px-3 text-white rounded-sm md:border-0 md:p-0">
                {t.sessions}
              </Link>
              
            </li>
            <li>
              <a href="#" onClick={handleLogout} className="block py-2 px-3 text-white rounded-sm md:border-0 md:p-0">
                {isLoggedIn? t2.logout: t2.login}
              </a>
              
            </li>
            <li>
              <div className="block py-2 px-3 text-white rounded-sm md:border-0 md:p-0">
              <LanguageSelector />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
