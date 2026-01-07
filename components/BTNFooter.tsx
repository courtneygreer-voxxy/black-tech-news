'use client';

import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function BTNFooter() {
  return (
    <footer className="bg-black text-white border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        <div className="flex flex-col space-y-6">
          {/* Top Row: Branding and Social Media */}
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
                  © {new Date().getFullYear()} Wolf Development Studios LLC
                </p>
                <p className="text-xs text-gray-500">
                  Black Tech News
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500 hidden md:inline">Follow Us</span>
              <a
                href="https://www.instagram.com/blacktechnews.cc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/blacktechnewscc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow us on X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.reddit.com/r/blacktechnews/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Join us on Reddit"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom Row: Links */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-800">
            <a
              href="mailto:staff@blacktechnews.cc"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="https://wolfdevelopmentstudio.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="https://wolfdevelopmentstudio.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="https://wolfdevelopmentstudio.com"
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
