import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="container mx-auto flex items-center justify-center relative z-10">
        <div className="text-center">
          <span className="font-semibold">🚀 Flash Sale: Save 40% on all courses!</span>
          <span className="ml-2 text-orange-100">Offer ends in 2 days</span>
          <button 
            onClick={() => navigate('/courses?sale=flash')}
            className="ml-4 bg-white text-orange-500 px-4 py-1 rounded-full text-sm font-semibold hover:bg-orange-50 transition-colors"
          >
            Shop Now
          </button>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}