'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface NavbarWrapperProps {
  onToggleSidebar: () => void;
}

const NavbarWrapper: React.FC<NavbarWrapperProps> = ({ onToggleSidebar }) => {
  const router = useRouter();
  
  const handleTitleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    router.push('/');
  };

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
        <a href="/" onClick={handleTitleClick} className="flex items-center cursor-pointer group">
          <h1 className="text-3xl sm:text-4xl font-bold text-cream-pulp font-display group-hover:text-sun-bark/80 transition-colors duration-200 ease-out">Sporelia</h1>
        </a>
      </div>
    </nav>
  );
};

export default NavbarWrapper;
