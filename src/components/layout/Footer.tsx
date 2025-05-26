import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Sporelia. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-gray-500 hover:text-gray-900">
              About
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-900">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 