import toast from 'react-hot-toast';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import React from 'react';

export const showSuccess = (message) =>
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-white border-l-4 border-green-500 animate-fade-in-up ${t.visible ? 'opacity-100' : 'opacity-0'}`}
         style={{ minWidth: 250 }}>
      <FaCheckCircle className="text-green-500 text-xl" />
      <span className="text-gray-800 font-medium">{message}</span>
    </div>
  ));

export const showError = (message) =>
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-white border-l-4 border-red-500 animate-fade-in-up ${t.visible ? 'opacity-100' : 'opacity-0'}`}
         style={{ minWidth: 250 }}>
      <FaExclamationCircle className="text-red-500 text-xl" />
      <span className="text-gray-800 font-medium">{message}</span>
    </div>
  ));

export const showInfo = (message) =>
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-white border-l-4 border-blue-500 animate-fade-in-up ${t.visible ? 'opacity-100' : 'opacity-0'}`}
         style={{ minWidth: 250 }}>
      <FaInfoCircle className="text-blue-500 text-xl" />
      <span className="text-gray-800 font-medium">{message}</span>
    </div>
  )); 