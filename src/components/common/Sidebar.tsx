import React from 'react';
import { Route } from '../../types'; 
import { useModal } from '../../lib/ModalContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  plantTypes: string[];
  staticCategories: string[];
  currentRoute: Route; 
  onNavigate: (hash: string) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  plantTypes = [], 
  staticCategories = [], 
  currentRoute,
  onNavigate
}) => {
  const { isOpen: isModalOpen } = useModal();
  
  // Don't show sidebar overlay if modal is open
  const shouldShowOverlay = isOpen && !isModalOpen;
  
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
    return currentRoute?.path === 'home';
  };

  const isPlantFilterActive = (type: string) => {
    return currentRoute?.path === 'plants' && currentRoute?.filter === type;
  };

  const isStaticCategoryActive = (categoryPath: string) => {
    return currentRoute?.path === categoryPath;
  };


  return (
    <>
      {/* Backdrop - only show if sidebar is open AND no modal is open */}
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
            <button
              onClick={() => onNavigate('#/')}
              onKeyDown={(e) => handleKeyDown(e, () => onNavigate('#/'))}
              className={`${itemBaseClasses} ${isHomeActive() ? activeItemClasses : inactiveItemClasses}`}
              aria-current={isHomeActive() ? 'page' : undefined}
            >
              <i className="fas fa-home mr-3 w-5 text-center opacity-75"></i>Home
            </button>

            {/* Plant Filters */}
            <div className="pt-3 mt-3 border-t border-lichen-veil">
              <h3 className="px-3 py-2 text-xs font-heading font-semibold text-text-muted uppercase tracking-wider">My Plants</h3>
              <button
                onClick={() => onNavigate('#/plants/All')}
                onKeyDown={(e) => handleKeyDown(e, () => onNavigate('#/plants/All'))}
                className={`${itemBaseClasses} ${isPlantFilterActive('All') ? activeItemClasses : inactiveItemClasses}`}
                aria-current={isPlantFilterActive('All') ? 'page' : undefined}
              >
                <i className="fas fa-seedling mr-3 w-5 text-center opacity-75"></i>All Plants
              </button>
              {(plantTypes || []).map(type => (
                <button
                  key={type}
                  onClick={() => onNavigate(`#/plants/${type}`)}
                  onKeyDown={(e) => handleKeyDown(e, () => onNavigate(`#/plants/${type}`))}
                  className={`${itemBaseClasses} ${isPlantFilterActive(type) ? activeItemClasses : inactiveItemClasses}`}
                  aria-current={isPlantFilterActive(type) ? 'page' : undefined}
                >
                  <i className="fas fa-tag mr-3 w-5 text-center opacity-75"></i>{type}
                </button>
              ))}
            </div>
            
            {/* Static Categories */}
            {(staticCategories || []).length > 0 && (
              <div className="pt-4 mt-4 border-t border-lichen-veil">
                 <h3 className="px-3 py-2 text-xs font-heading font-semibold text-text-muted uppercase tracking-wider">Plant Hub</h3>
                {(staticCategories || []).map(category => {
                  const categoryPath = category.toLowerCase();
                  return (
                    <button
                      key={category}
                      onClick={() => onNavigate(`#/${categoryPath}`)}
                      onKeyDown={(e) => handleKeyDown(e, () => onNavigate(`#/${categoryPath}`))}
                      className={`${itemBaseClasses} ${isStaticCategoryActive(categoryPath) ? activeItemClasses : inactiveItemClasses}`}
                      aria-current={isStaticCategoryActive(categoryPath) ? 'page' : undefined}
                    >
                      {category === "Pests" && <i className="fas fa-bug mr-3 w-5 text-center opacity-75"></i>}
                      {category === "Fertilizer" && <i className="fas fa-flask mr-3 w-5 text-center opacity-75"></i>}
                      {category === "Soil" && <i className="fas fa-leaf mr-3 w-5 text-center opacity-75"></i>}
                      {category}
                    </button>
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