'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plant } from '../../types';
import * as plantService from '../../lib/plantService';
import PlantCardWrapper from './PlantCardWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { DEFAULT_PLANT_IMAGE } from '../../constants';
import { usePlantStore, OPERATIONS } from '../../lib/PlantStoreContext'; 
import { useModal } from '../../lib/ModalContext';
import { startAsyncAction, successAsyncAction, errorAsyncAction, clearError } from '../../lib/plantStoreActions'; 

interface PlantCollectionPageWrapperProps {
  plantTypeFilter?: string;
}

const MAX_PREVIEW_PLANTS_PER_TYPE = 4;

const PlantCollectionPageWrapper: React.FC<PlantCollectionPageWrapperProps> = ({ plantTypeFilter }) => {
  const { state: plantState, dispatch: plantDispatch } = usePlantStore(); 
  const { plants, isLoading: isLoadingPlants, error: plantStoreError } = plantState;
  const { openModal } = useModal();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');

  const handleAddPlantClick = () => {
    openModal('plantForm', { mode: 'add' });
  };

  const handleEditPlantClick = (plant: Plant) => {
    openModal('plantForm', { plant, mode: 'edit' });
  };
  
  const handleViewDetails = (plant: Plant) => {
    router.push(`/plant/${plant.id}`);
  };

  const handleDeletePlantClick = (plantId: string, plantName: string) => {
    openModal('confirmation', {
      title: "Confirm Deletion",
      message: `Are you sure you want to delete "${plantName}"? This action cannot be undone.`,
      confirmText: "Delete",
      onConfirm: () => handleDeletePlant(plantId)
    });
  };

  const handleDeletePlant = async (plantId: string) => {
    console.log('Deleting plant:', plantId);
    try {
      plantDispatch(startAsyncAction(OPERATIONS.DELETE_PLANT));
      await plantService.deletePlant(plantId);
      plantDispatch(successAsyncAction(OPERATIONS.DELETE_PLANT, { deletedPlantId: plantId }));
    } catch (error) {
      console.error('Error deleting plant:', error);
      plantDispatch(errorAsyncAction(OPERATIONS.DELETE_PLANT, error instanceof Error ? error.message : 'Failed to delete plant'));
    }
  };

  // Filter and search logic
  const filteredPlants = useMemo(() => {
    if (!plants) return [];
    
    let result = plants;

    // Apply plant type filter
    if (plantTypeFilter && plantTypeFilter !== 'All') {
      result = result.filter(plant => plant.type === plantTypeFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(plant => 
        plant.name.toLowerCase().includes(searchLower) ||
        (plant.species && plant.species.toLowerCase().includes(searchLower)) ||
        (plant.type && plant.type.toLowerCase().includes(searchLower))
      );
    }

    return result;
  }, [plants, plantTypeFilter, searchTerm]);

  // Group plants by type for display
  const plantsByType = useMemo(() => {
    const grouped: Record<string, Plant[]> = {};
    
    filteredPlants.forEach(plant => {
      const type = plant.type || 'Uncategorized';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(plant);
    });

    return grouped;
  }, [filteredPlants]);

  // Loading state
  if (isLoadingPlants) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (plantStoreError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <i className="fas fa-exclamation-triangle text-3xl mb-2"></i>
          <p className="text-lg font-semibold">Error loading plants</p>
          <p className="text-sm">{plantStoreError}</p>
        </div>
        <button
          onClick={() => plantDispatch(clearError())}
          className="bg-canopy-green text-cream-pulp px-4 py-2 rounded-button hover:bg-opacity-90 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!plants || plants.length === 0) {
    return (
      <div className="text-center py-20">
        <i className="fas fa-seedling fa-5x text-lichen-veil mb-8"></i>
        <h2 className="text-3xl font-bold text-canopy-green font-heading mb-4">Your Garden Awaits</h2>
        <p className="text-xl text-text-muted font-body mb-8 max-w-lg mx-auto">
          Ready to start your plant journey? Add your first green companion and watch your digital garden flourish.
        </p>
        <button
          onClick={handleAddPlantClick}
          className="bg-canopy-green hover:bg-opacity-90 text-cream-pulp font-medium py-3 px-8 rounded-button shadow-sm hover:shadow-interactive transition-all duration-200 ease-out text-base uppercase tracking-wider focus:outline-none focus-style"
        >
          <i className="fas fa-plus mr-2"></i>Add Your First Plant
        </button>
      </div>
    );
  }

  // Filter applied but no results
  if (filteredPlants.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-canopy-green font-heading">
              {plantTypeFilter && plantTypeFilter !== 'All' ? `${plantTypeFilter} Plants` : 'My Plants'}
            </h1>
            <p className="text-text-muted font-body mt-1">
              {plantTypeFilter && plantTypeFilter !== 'All' 
                ? `Browse your ${plantTypeFilter.toLowerCase()} collection`
                : 'Your personal plant collection'
              }
            </p>
          </div>
          <button
            onClick={handleAddPlantClick}
            className="bg-canopy-green hover:bg-opacity-90 text-cream-pulp font-medium py-2.5 px-6 rounded-button shadow-sm hover:shadow-interactive transition-all duration-200 ease-out text-sm uppercase tracking-wider focus:outline-none focus-style"
          >
            <i className="fas fa-plus mr-2"></i>Add Plant
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-lichen-veil rounded-button bg-cream-pulp text-canopy-green placeholder-text-muted focus:outline-none focus-style"
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
        </div>

        {/* No results message */}
        <div className="text-center py-12">
          <i className="fas fa-search fa-3x text-lichen-veil mb-6"></i>
          <h3 className="text-xl font-bold text-canopy-green font-heading mb-2">No plants found</h3>
          <p className="text-text-muted font-body mb-6">
            {searchTerm ? `No plants match "${searchTerm}"` : `No ${plantTypeFilter} plants in your collection yet`}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-sage-mist hover:bg-opacity-90 text-cream-pulp font-medium py-2 px-6 rounded-button transition-all duration-200 ease-out text-sm focus:outline-none focus-style"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-canopy-green font-heading">
            {plantTypeFilter && plantTypeFilter !== 'All' ? `${plantTypeFilter} Plants` : 'My Plants'}
          </h1>
          <p className="text-text-muted font-body mt-1">
            {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''} 
            {plantTypeFilter && plantTypeFilter !== 'All' 
              ? ` in your ${plantTypeFilter.toLowerCase()} collection`
              : ' in your collection'
            }
          </p>
        </div>
        <button
          onClick={handleAddPlantClick}
          className="bg-canopy-green hover:bg-opacity-90 text-cream-pulp font-medium py-2.5 px-6 rounded-button shadow-sm hover:shadow-interactive transition-all duration-200 ease-out text-sm uppercase tracking-wider focus:outline-none focus-style"
        >
          <i className="fas fa-plus mr-2"></i>Add Plant
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search plants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-lichen-veil rounded-button bg-cream-pulp text-canopy-green placeholder-text-muted focus:outline-none focus-style"
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
      </div>

      {/* Plants Grid */}
      <div className="space-y-8">
        {Object.entries(plantsByType).map(([type, typePlants]) => (
          <div key={type}>
            {/* Type Header (only show if not filtering by specific type) */}
            {(!plantTypeFilter || plantTypeFilter === 'All') && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-canopy-green font-heading">
                  {type} 
                  <span className="text-text-muted text-base font-normal ml-2">
                    ({typePlants.length})
                  </span>
                </h2>
              </div>
            )}
            
            {/* Plants Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {typePlants.map((plant) => (
                <PlantCardWrapper
                  key={plant.id}
                  plant={plant}
                  onEdit={handleEditPlantClick}
                  onDelete={handleDeletePlantClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantCollectionPageWrapper;
