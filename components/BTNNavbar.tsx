'use client';

import Link from 'next/link';

export default function BTNNavbar() {
  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-12 bg-red-600"></div>
              <div className="w-2 h-12 bg-black"></div>
              <div className="w-2 h-12 bg-green-600"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Black Tech News
              </h1>
              <p className="text-xs text-gray-600 tracking-wide uppercase">
                The News You Need to Know
              </p>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
