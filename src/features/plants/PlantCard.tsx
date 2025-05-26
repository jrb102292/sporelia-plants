import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plant } from '../../types';
import { DEFAULT_PLANT_IMAGE } from '../../constants';

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: (plantId: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const imageUrl = plant.imageDataUrl || `${DEFAULT_PLANT_IMAGE}&id=${plant.id}`;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleViewDetails = () => {
    navigate(`/plant/${plant.id}`);
  };

  return (
    <div 
      data-testid={`plant-card-${plant.id}`}
      className="bg-cream-pulp rounded-card shadow-subtle overflow-hidden transform hover:scale-[1.03] transition-transform duration-200 ease-out flex flex-col border border-lichen-veil/70"
    >
      <img 
        src={imageUrl} 
        alt={plant.name} 
        className="w-full h-52 object-cover" // Increased height slightly
        style={{ filter: 'saturate(0.7)' }} // 70% desaturation for plant photography
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = `${DEFAULT_PLANT_IMAGE}&id=${plant.id}_fallback`;
        }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-heading font-semibold text-canopy-green mb-1">{plant.name}</h3>
        <p className="text-sm text-text-muted font-body italic mb-2">{plant.species}</p>
        
        {plant.plantType && plant.plantType !== "Uncategorized" && (
          <span className="text-xs font-medium bg-lichen-veil text-canopy-green px-2.5 py-1 rounded-full self-start mb-3">
            {plant.plantType}
          </span>
        )}

        <div className="text-xs text-text-muted font-body mb-3 space-y-0.5">
          <p><i className="fas fa-calendar-alt fa-fw mr-1.5 opacity-70"></i>Acquired: {formatDate(plant.acquisitionDate)}</p>
          {plant.lastWatered && <p><i className="fas fa-tint fa-fw mr-1.5 opacity-70 text-blue-500"></i>Last Watered: {formatDate(plant.lastWatered)}</p>}
        </div>

        {plant.notes && <p className="text-text-muted text-sm font-body mb-4 line-clamp-2 flex-grow">{plant.notes}</p>}
        {!plant.notes && <div className="flex-grow"></div>}

        <div className="mt-auto flex space-x-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 border border-sage-mist text-sage-mist hover:bg-sage-mist hover:text-cream-pulp font-medium py-2 px-3 rounded-button transition-all duration-200 ease-out text-sm uppercase tracking-wide focus:outline-none focus-style flex items-center justify-center"
            aria-label={`View details for ${plant.name}`}
          >
            <i className="fas fa-eye mr-2"></i>Details
          </button>
          <button
            onClick={() => onEdit(plant)}
            className="border border-sage-mist text-sage-mist hover:bg-sage-mist hover:text-cream-pulp font-medium py-2 px-2.5 rounded-button transition-all duration-200 ease-out text-sm focus:outline-none focus-style"
            title="Edit"
            aria-label={`Edit ${plant.name}`}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => onDelete(plant.id)}
            className="border border-sun-bark/80 text-sun-bark/80 hover:bg-sun-bark/80 hover:text-canopy-green font-medium py-2 px-2.5 rounded-button transition-all duration-200 ease-out text-sm focus:outline-none focus-style"
            title="Delete"
            aria-label={`Delete ${plant.name}`}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;