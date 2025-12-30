'use client';

import Link from 'next/link';

export default function BTNFooter() {
  return (
    <footer className="bg-black text-white border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Branding */}
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-8 bg-red-600"></div>
              <div className="w-2 h-8 bg-white"></div>
              <div className="w-2 h-8 bg-green-600"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400">
                © 2025 Black Tech News
              </p>
              <a
                href="https://www.wolfdevelopmentstudio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                A Wolf Development Studio App
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
            </Link>
            <a
              href="https://www.wolfdevelopmentstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Wolf Studio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
