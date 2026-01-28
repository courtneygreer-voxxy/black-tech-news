'use client';

import { useState } from 'react';

export default function EmailSignup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'website',
          referrer_url: window.location.href,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Welcome! You\'re now subscribed to our newsletter.');
        setEmail('');
        setTimeout(() => {
          setIsOpen(false);
          setTimeout(() => {
            setStatus('idle');
            setMessage('');
          }, 300);
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-40 bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-all hover:scale-105 flex items-center space-x-2"
        aria-label="Join our email list"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <span>Join our email list</span>
      </button>

      {/* Slide-in Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform animate-slide-in">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="bg-black text-white p-6 border-b-4 border-red-600">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold">Stay Informed</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-red-600 transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-300 text-sm">
                  Get weekly Black tech news delivered to your inbox every Monday
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {status === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      You're all set!
                    </h3>
                    <p className="text-gray-600">{message}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        What you'll get:
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="w-1 h-6 bg-red-600 mr-3 mt-1"></span>
                          <span className="text-gray-700">
                            Weekly digest of top Black tech stories
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1 h-6 bg-red-600 mr-3 mt-1"></span>
                          <span className="text-gray-700">
                            Startup funding announcements
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1 h-6 bg-red-600 mr-3 mt-1"></span>
                          <span className="text-gray-700">
                            Career opportunities at leading tech companies
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-1 h-6 bg-red-600 mr-3 mt-1"></span>
                          <span className="text-gray-700">
                            HBCU tech programs and resources
                          </span>
                        </li>
                      </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={status === 'loading'}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      {message && status === 'error' && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-sm text-red-800">
                          {message}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {status === 'loading' ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Subscribing...
                          </>
                        ) : (
                          'Subscribe Now'
                        )}
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
