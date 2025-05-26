'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Route {
  path: string;
  filter?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  plantTypes: string[];
  staticCategories: string[];
  currentRoute: Route; 
  onNavigate: (path: string) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  plantTypes = [], 
  staticCategories = [], 
  currentRoute,
  onNavigate
}) => {
  const pathname = usePathname();
  
  // Don't show sidebar overlay if modal is open (we'll implement modal detection later)
  const shouldShowOverlay = isOpen;
  
  if (!isOpen && typeof document === 'undefined') return null;

  const activeItemClasses = "bg-sage-mist text-cream-pulp";
  const inactiveItemClasses = "text-canopy-green hover:bg-lichen-veil hover:text-canopy-green";
  const itemBaseClasses = "block w-full text-left px-4 py-2.5 rounded-button font-medium transition-colors duration-200 ease-out text-sm font-body";

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const isHomeActive = () => {
    return pathname === '/';
  };

  const isPlantFilterActive = (type: string) => {
    if (type === 'All') {
      return pathname === '/plants';
    }
    return pathname === `/plants/${type}`;
  };

  const isStaticCategoryActive = (categoryPath: string) => {
    return pathname === `/${categoryPath}`;
  };

  const handleNavigation = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop - only show if sidebar is open */}
      <div 
        className={`fixed inset-0 bg-canopy-green bg-opacity-40 z-[45] transition-opacity duration-300 ease-in-out ${shouldShowOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 w-64 sm:w-72 h-full bg-cream-pulp shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-lichen-veil">
            <h2 id="sidebar-title" className="text-xl font-heading font-semibold text-canopy-green">Menu</h2>
            <button 
              onClick={onClose} 
              className="text-sage-mist hover:text-canopy-green text-2xl p-1 rounded-button focus:outline-none focus-style"
              aria-label="Close navigation menu"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto" role="navigation">
            {/* Home Link */}
            <Link
              href="/"
              onClick={() => handleNavigation('/')}
              className={`${itemBaseClasses} ${isHomeActive() ? activeItemClasses : inactiveItemClasses}`}
              aria-current={isHomeActive() ? 'page' : undefined}
            >
              <i className="fas fa-home mr-3 w-5 text-center opacity-75"></i>Home
            </Link>

            {/* Plant Filters */}
            <div className="pt-3 mt-3 border-t border-lichen-veil">
              <h3 className="px-3 py-2 text-xs font-heading font-semibold text-text-muted uppercase tracking-wider">My Plants</h3>
              <Link
                href="/plants"
                onClick={() => handleNavigation('/plants')}
                className={`${itemBaseClasses} ${isPlantFilterActive('All') ? activeItemClasses : inactiveItemClasses}`}
                aria-current={isPlantFilterActive('All') ? 'page' : undefined}
              >
                <i className="fas fa-seedling mr-3 w-5 text-center opacity-75"></i>All Plants
              </Link>
              {(plantTypes || []).map(type => (
                <Link
                  key={type}
                  href={`/plants/${type}`}
                  onClick={() => handleNavigation(`/plants/${type}`)}
                  className={`${itemBaseClasses} ${isPlantFilterActive(type) ? activeItemClasses : inactiveItemClasses}`}
                  aria-current={isPlantFilterActive(type) ? 'page' : undefined}
                >
                  <i className="fas fa-tag mr-3 w-5 text-center opacity-75"></i>{type}
                </Link>
              ))}
            </div>
            
            {/* Static Categories */}
            {(staticCategories || []).length > 0 && (
              <div className="pt-4 mt-4 border-t border-lichen-veil">
                 <h3 className="px-3 py-2 text-xs font-heading font-semibold text-text-muted uppercase tracking-wider">Plant Hub</h3>
                {(staticCategories || []).map(category => {
                  const categoryPath = category.toLowerCase();
                  return (
                    <Link
                      key={category}
                      href={`/${categoryPath}`}
                      onClick={() => handleNavigation(`/${categoryPath}`)}
                      className={`${itemBaseClasses} ${isStaticCategoryActive(categoryPath) ? activeItemClasses : inactiveItemClasses}`}
                      aria-current={isStaticCategoryActive(categoryPath) ? 'page' : undefined}
                    >
                      {category === "Pests" && <i className="fas fa-bug mr-3 w-5 text-center opacity-75"></i>}
                      {category === "Fertilizer" && <i className="fas fa-flask mr-3 w-5 text-center opacity-75"></i>}
                      {category === "Soil" && <i className="fas fa-leaf mr-3 w-5 text-center opacity-75"></i>}
                      {category}
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>
          <div className="p-4 border-t border-lichen-veil">
             <p className="text-xs text-text-muted/70 font-body">&copy; {new Date().getFullYear()} Sporelia</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
