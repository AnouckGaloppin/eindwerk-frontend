"use client";

import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Always show the banner when user visits the website
    setShowBanner(true);
  }, []);

  const handleAccept = () => {
    const consent = {
      necessary: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Cookie className="w-6 h-6 text-teal-500" />
            <h2 className="text-lg font-semibold text-gray-900">We use cookies</h2>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            We use necessary cookies to ensure our website functions properly. 
            These cookies are essential for features like user authentication and session management.
            You must accept these cookies to use our website.
          </p>

          <div className="flex justify-end">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 