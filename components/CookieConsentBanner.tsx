'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie_consent';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check for consent on client-side only
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent !== 'true') {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        <p className="text-sm text-gray-300">
          We use cookies to enhance your experience and for advertising purposes. By
          clicking "Accept", you agree to our{' '}
          <Link href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          onClick={handleAccept}
          className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
