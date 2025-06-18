// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router';
import LanguageSelector from './LanguageSelector';
import { useLanguageStore } from '../store/useLanguageStore';
import { NavbarTranslations } from './constant';

export default function Navbar() {
  const language = useLanguageStore((state) => state.language);
  const t = NavbarTranslations[language]; // translation shortcut

  return (
    <nav className="bg-primary border-red-400 border-b-2 shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className='flex justify-start'>
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
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
