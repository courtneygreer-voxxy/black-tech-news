'use client';

import { useEffect } from 'react';

export default function TermsPage() {
  useEffect(() => {
    // Redirect to Wolf Studio's centralized terms of service
    window.location.href = 'https://wolfdevelopmentstudio.com/terms';
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Redirecting to Terms of Service...</h1>
        <p className="text-gray-600">
          If you are not redirected automatically,{' '}
          <a href="https://wolfdevelopmentstudio.com/terms" className="text-red-600 underline">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
