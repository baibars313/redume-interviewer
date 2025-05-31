// src/components/LanguageSelector.js
import React from 'react';
import { useLanguageStore } from '../store/useLanguageStore';

const LanguageSelector = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <div className="flex items-center space-x-2">
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="p-2 border border-white rounded-md shadow-sm text-sm text-white"
      >
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
