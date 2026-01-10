"use client";
import { useState, useEffect } from 'react';

export default function Newsletter() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the popup after 5 seconds
    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-bounce-in">
      <div className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-blue-600 max-w-xs">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-black font-bold"
        >
          ✕
        </button>
        <h3 className="text-lg font-black text-gray-900 mb-2">Don't Miss Out! 🚀</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get the top 5 free courses of the week delivered to your inbox.
        </p>
        <input 
          type="email" 
          placeholder="Enter your email"
          className="w-full p-3 rounded-xl border border-gray-200 mb-3 text-black font-bold focus:border-blue-600 outline-none"
        />
        <button className="w-full bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition-colors">
          Subscribe Now
        </button>
      </div>
    </div>
  );
}
