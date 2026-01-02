'use client';

import { useEffect } from 'react';

export default function PrivacyPage() {
  useEffect(() => {
    // Redirect to Wolf Studio's centralized privacy policy
    window.location.href = 'https://wolfdevelopmentstudio.com/privacy';
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Redirecting to Privacy Policy...</h1>
        <p className="text-gray-600">
          If you are not redirected automatically,{' '}
          <a href="https://wolfdevelopmentstudio.com/privacy" className="text-red-600 underline">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
