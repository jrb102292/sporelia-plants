import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plant } from '../../types';
// Fix: Import plantService for direct calls
import * as plantService from '../../lib/plantService';
import PlantCard from './PlantCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { DEFAULT_PLANT_IMAGE } from '../../constants';
// Fix: Import usePlantStore from the correct path
import { usePlantStore, OPERATIONS } from '../../lib/PlantStoreContext'; 
// Fix: Import useModal from the correct path
import { useModal } from '../../lib/ModalContext';
import { startAsyncAction, successAsyncAction, errorAsyncAction, clearError } from '../../lib/plantStoreActions'; 

interface PlantCollectionPageProps {
  plantTypeFilter: string;
}

const MAX_PREVIEW_PLANTS_PER_TYPE = 4;

const PlantCollectionPage: React.FC<PlantCollectionPageProps> = ({ plantTypeFilter }) => {
  const { state: plantState, dispatch: plantDispatch } = usePlantStore(); 
  const { plants, isLoading: isLoadingPlants, error: plantStoreError } = plantState;
  const { openModal } = useModal();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Fix: Remove redundant useEffect for UPDATE_DYNAMIC_PLANT_TYPES as reducer handles it
  // useEffect(() => {
  // }, [plants, plantDispatch]);


  const handleAddPlantClick = () => {
    openModal('plantForm', { mode: 'add' });
  };

  const handleEditPlantClick = (plant: Plant) => {
    openModal('plantForm', { plant, mode: 'edit' });
  };
  
  const handleViewDetails = (plant: Plant) => {
    navigate(`/plant/${plant.id}`);
  };

  const handleDeletePlantClick = (plantId: string, plantName: string) => {
    openModal('confirmation', {
      title: "Confirm Deletion",
      message: `Are you sure you want to remove "${plantName}" from your collection? This action cannot be undone.`,
      onConfirm: async () => {
        // Use new action pattern for delete operation
        plantDispatch(startAsyncAction(OPERATIONS.DELETE_PLANT, plantId));
        try {
          const result = await plantService.deletePlant(plantId);
          if (result.data) {
            plantDispatch(successAsyncAction(OPERATIONS.DELETE_PLANT, plantId, plantId));
          } else {
            plantDispatch(errorAsyncAction(OPERATIONS.DELETE_PLANT, result.error || 'Failed to delete plant', plantId));
          }
        } catch (error) {
          plantDispatch(errorAsyncAction(OPERATIONS.DELETE_PLANT, 'Failed to delete plant', plantId));
        }
      },
      confirmText: "Delete",
    });
  };

  const filteredPlantsForCardView = useMemo(() => {
    return plants.filter(plant => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearchTerm = plant.name.toLowerCase().includes(searchLower) ||
                                plant.species.toLowerCase().includes(searchLower) ||
                                (plant.notes && plant.notes.toLowerCase().includes(searchLower)) ||
                                (plant.plantType && plant.plantType.toLowerCase().includes(searchLower));
      
      const plantTypeForCurrentPlant = plant.plantType || "Uncategorized";
      const matchesTypeFilter = plantTypeFilter === 'All' || plantTypeForCurrentPlant === plantTypeFilter;
      
      return matchesSearchTerm && matchesTypeFilter;
    });
  }, [plants, searchTerm, plantTypeFilter]);

  const plantsByTypeForShowcase = useMemo(() => {
    if (plantTypeFilter !== 'All' || searchTerm) return {}; 

    const grouped = plants.reduce<Record<string, Plant[]>>((acc, plant) => {
      const type = plant.plantType || "Uncategorized";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(plant);
      return acc;
    }, {});
    
    const sortedTypes = Object.keys(grouped).sort((a, b) => {
        if (a === "Uncategorized") return 1; 
        if (b === "Uncategorized") return -1;
        return a.localeCompare(b);
    });

    const result: Record<string, Plant[]> = {};
    sortedTypes.forEach(type => {
        result[type] = grouped[type];
    });
    return result;

  }, [plants, plantTypeFilter, searchTerm]);


  const renderShowcaseView = () => {
    const types = Object.keys(plantsByTypeForShowcase);
    if (types.length === 0 && plants.length > 0) { 
        return renderCardView(plants); 
    }
    if (types.length === 0 && plants.length === 0 && !isLoadingPlants) return renderEmptyState();

    return (
      <div className="space-y-10">
        {types.map(type => (
          <section key={type} aria-labelledby={`plant-type-heading-${type.replace(/\s+/g, '-')}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 id={`plant-type-heading-${type.replace(/\s+/g, '-')}`} className="text-2xl font-heading font-semibold text-canopy-green">
                {type} ({plantsByTypeForShowcase[type].length})
              </h3>
              <a 
                href={`/plants/${type}`} 
                onClick={(e) => { e.preventDefault(); navigate(`/plants/${type}`); }}
                className="text-sm font-medium text-sage-mist hover:text-canopy-green hover:underline focus:outline-none focus-style rounded-sm"
              >
                View All {type}
              </a>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-3 -mb-3">
              {plantsByTypeForShowcase[type].slice(0, MAX_PREVIEW_PLANTS_PER_TYPE).map(plant => (
                <div 
                  key={plant.id} 
                  className="group flex-shrink-0 w-40 h-48 sm:w-48 sm:h-56 bg-lichen-veil/30 rounded-lg overflow-hidden shadow-subtle border border-lichen-veil/50 cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-out"
                  onClick={() => handleViewDetails(plant)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleViewDetails(plant);}}
                  aria-label={`View details for ${plant.name}`}
                >
                  <img 
                    src={plant.imageDataUrl || `${DEFAULT_PLANT_IMAGE}&id=${plant.id}_showcase`} 
                    alt={plant.name} 
                    className="w-full h-3/4 object-cover"
                    style={{ filter: 'saturate(0.7)'}}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = `${DEFAULT_PLANT_IMAGE}&id=${plant.id}_showcase_fallback`;}}
                  />
                  <div className="p-2 h-1/4 flex flex-col justify-center">
                    <p className="text-xs font-semibold text-canopy-green truncate group-hover:underline">{plant.name}</p>
                    <p className="text-xs text-text-muted italic truncate">{plant.species}</p>
                  </div>
                </div>
              ))}
              {plantsByTypeForShowcase[type].length === 0 && (
                <p className="text-sm text-text-muted italic p-4">No plants in this category yet.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    );
  };

  const renderCardView = (items: Plant[]) => {
    if (items.length === 0 && !isLoadingPlants) return renderEmptyState();
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
        {items.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onEdit={() => handleEditPlantClick(plant)}
            onDelete={() => handleDeletePlantClick(plant.id, plant.name)}
          />
        ))}
      </div>
    );
  };
  
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <i className="fas fa-leaf fa-4x text-lichen-veil mb-6"></i>
      <h3 className="text-2xl text-canopy-green font-heading mb-3">
        {plants.length === 0 && plantTypeFilter === 'All' ? "Your garden awaits its first sprout!" : "No plants match this view."}
      </h3>
      <p className="text-text-muted font-body mb-8 max-w-md mx-auto">
        {plants.length === 0 && plantTypeFilter === 'All' ? "Let's add your first green companion and watch your collection flourish." : "Try adjusting your search or filter, or add a new plant to this category to see it here."}
      </p>
      <button
        onClick={handleAddPlantClick}
        className="bg-canopy-green hover:bg-opacity-90 text-cream-pulp font-medium py-3 px-6 rounded-button shadow-sm hover:shadow-interactive transition-all duration-200 ease-out text-base uppercase tracking-wider focus:outline-none focus-style"
      >
        <i className="fas fa-plus mr-2"></i>Add New Plant
      </button>
    </div>
  );


  if (isLoadingPlants && plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <LoadingSpinner color="border-canopy-green" size="w-16 h-16" />
        <p className="text-canopy-green font-heading mt-6 text-lg">Cultivating your plant collection...</p>
        <p className="text-text-muted text-sm mt-1">Please wait a moment.</p>
      </div>
    );
  }

  const showShowcaseView = plantTypeFilter === 'All' && !searchTerm && plants.length > 0;

  return (
    <>
      {plantStoreError && (
        <div className="bg-sun-bark/30 border border-sun-bark text-canopy-green px-4 py-3 rounded-md relative mb-6" role="alert">
          <strong className="font-bold font-heading">Oops! </strong>
          <span className="block sm:inline font-body">{plantStoreError}</span>
          <button onClick={() => plantDispatch(clearError())} className="absolute top-0 bottom-0 right-0 px-4 py-3 text-sun-bark hover:text-canopy-green">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-heading font-semibold text-canopy-green shrink-0 order-1">
          {plantTypeFilter === 'All' && !searchTerm ? 'All Plants Overview' : (plantTypeFilter === 'All' ? 'All Plants (Filtered)' : plantTypeFilter)}
          {!showShowcaseView && <span className="text-xl text-text-muted ml-2 font-body">({filteredPlantsForCardView.length})</span>}
        </h2>
         <input 
          type="text"
          placeholder={showShowcaseView ? "Search all plants..." : "Search in current view..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2.5 border border-lichen-veil bg-cream-pulp text-canopy-green rounded-button shadow-sm focus:outline-none focus:border-sage-mist focus:ring-1 focus:ring-sage-mist w-full sm:w-auto order-2 sm:order-none font-body text-sm"
          aria-label="Search plants"
        />
      </div>
      
      {showShowcaseView ? renderShowcaseView() : renderCardView(filteredPlantsForCardView)}
      
      { (plants.length > 0 || searchTerm || plantTypeFilter !== 'All') && (
        <button
          onClick={handleAddPlantClick}
          title="Add New Plant"
          aria-label="Add New Plant"
          className="fixed bottom-8 right-8 bg-sun-bark hover:bg-opacity-90 text-canopy-green w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl transition-transform duration-200 ease-out hover:scale-110 z-40 focus:outline-none focus-style"
        >
          <i className="fas fa-plus"></i>
        </button>
      )}
    </>
  );
};

export default PlantCollectionPage;
