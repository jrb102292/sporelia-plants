'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plant } from '../../types';
import { DEFAULT_PLANT_IMAGE } from '../../constants';

interface PlantCardWrapperProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: (plantId: string, plantName: string) => void;
}

const PlantCardWrapper: React.FC<PlantCardWrapperProps> = ({ plant, onEdit, onDelete }) => {
  const router = useRouter();
  const imageUrl = plant.imageDataUrl || `${DEFAULT_PLANT_IMAGE}&id=${plant.id}`;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleViewDetails = () => {
    router.push(`/plant/${plant.id}`);
  };

  return (
    <div 
      data-testid={`plant-card-${plant.id}`}
      className="bg-cream-pulp rounded-card shadow-subtle overflow-hidden transform hover:scale-[1.03] transition-transform duration-200 ease-out flex flex-col border border-lichen-veil/70"
    >
      {/* Plant Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={plant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `${DEFAULT_PLANT_IMAGE}&id=${plant.id}`;
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(plant);
            }}
            className="bg-cream-pulp bg-opacity-90 text-canopy-green p-1.5 rounded-full shadow-sm hover:bg-opacity-100 transition-all duration-200 text-sm focus:outline-none focus-style"
            aria-label={`Edit ${plant.name}`}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(plant.id, plant.name);
            }}
            className="bg-cream-pulp bg-opacity-90 text-sun-bark p-1.5 rounded-full shadow-sm hover:bg-opacity-100 transition-all duration-200 text-sm focus:outline-none focus-style"
            aria-label={`Delete ${plant.name}`}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* Plant Info */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-3 flex-grow">
          <h3 className="text-lg font-bold font-heading text-canopy-green mb-1">{plant.name}</h3>
          <p className="text-text-muted text-sm font-body">
            {plant.species || 'Unknown Species'}
          </p>              <div className="mt-2 text-xs text-text-muted/80 font-body">
                Added: {formatDate(plant.acquisitionDate)}
              </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleViewDetails}
          className="w-full bg-canopy-green hover:bg-opacity-90 text-cream-pulp font-medium py-2 px-4 rounded-button transition-all duration-200 ease-out text-sm uppercase tracking-wider focus:outline-none focus-style"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PlantCardWrapper;
