'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackCookieConsent } from '@/lib/analytics';

const COOKIE_CONSENT_KEY = 'cookie_consent';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check for consent on client-side only
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === null) {
      // No decision yet, show banner
      setShowBanner(true);
    } else if (consent === 'true') {
      // Already consented, grant analytics
      trackCookieConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    trackCookieConsent(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'false');
    trackCookieConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 gap-4">
        <p className="text-sm text-gray-300">
          We use cookies and analytics to improve your experience. We collect anonymized data including location, referral source, and engagement metrics. No personal information is stored without consent.{' '}
          <Link href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="bg-gray-700 text-white px-4 py-2 rounded-md font-bold hover:bg-gray-600 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
