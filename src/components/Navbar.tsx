'use client';

import Link from 'next/link';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <nav className="bg-canopy-green shadow-subtle sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center">
        <button 
          onClick={onToggleSidebar} 
          className="text-cream-pulp text-2xl p-2 mr-2 hover:bg-sage-mist/30 rounded-button focus:outline-none focus-style"
          aria-label="Open navigation menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        <Link href="/" className="flex items-center cursor-pointer group">
          {/* Placeholder for a more elaborate logo if needed */}
          {/* <i className="fas fa-leaf text-3xl text-cream-pulp mr-3 group-hover:text-sun-bark transition-colors duration-200"></i> */}
          <h1 className="text-3xl sm:text-4xl font-bold text-cream-pulp font-display group-hover:text-sun-bark/80 transition-colors duration-200 ease-out">Sporelia</h1>
        </Link>
        {/* Future navigation links can go on the right */}
      </div>
    </nav>
  );
}
