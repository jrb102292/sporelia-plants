'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plant, Comment } from '../../types';
import FirebasePlantRepository from '../../lib/FirebasePlantRepository';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CommentBox from '../../features/comments/CommentBox';
import { useModal } from '../../lib/ModalContext';

interface PlantDetailViewWrapperProps {
  plantId: string;
}

const PlantDetailViewWrapper: React.FC<PlantDetailViewWrapperProps> = ({ plantId }) => {
  const router = useRouter();
  const { openModal } = useModal();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlant = async () => {
      if (!plantId) {
        setError('No plant ID provided');
        setLoading(false);
        return;
      }

      try {    setLoading(true);
    setError(null);

    const plantData = await FirebasePlantRepository.getById(plantId);

    if (plantData) {
      setPlant(plantData);
    } else {
      setError('Plant not found');
    }
      } catch (err) {
        console.error('Error loading plant:', err);
        setError(err instanceof Error ? err.message : 'Failed to load plant');
      } finally {
        setLoading(false);
      }
    };

    loadPlant();
  }, [plantId]);

  const handleBackClick = () => {
    router.push('/plants');
  };

  const handleEditClick = () => {
    if (plant) {
      openModal('plantForm', { plant, mode: 'edit' });
    }
  };

  const handleDeleteClick = () => {
    if (plant) {
      openModal('confirmation', {
        title: "Confirm Deletion",
        message: `Are you sure you want to delete "${plant.name}"? This action cannot be undone.`,
        confirmText: "Delete",
        onConfirm: () => handleDeletePlant()
      });
    }
  };
  const handleDeletePlant = async () => {
    if (!plant) return;
    
    try {
      await FirebasePlantRepository.delete(plant.id);
      router.push('/plants');
    } catch (err) {
      console.error('Error deleting plant:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete plant');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <i className="fas fa-exclamation-triangle text-3xl mb-2"></i>
          <p className="text-lg font-semibold">Error loading plant</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={handleBackClick}
          className="bg-canopy-green text-cream-pulp px-4 py-2 rounded-button hover:bg-opacity-90 transition-all"
        >
          Back to Plants
        </button>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-seedling fa-3x text-lichen-veil mb-6"></i>
        <h3 className="text-xl font-bold text-canopy-green font-heading mb-2">Plant not found</h3>
        <p className="text-text-muted font-body mb-6">
          The plant you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={handleBackClick}
          className="bg-canopy-green text-cream-pulp px-4 py-2 rounded-button hover:bg-opacity-90 transition-all"
        >
          Back to Plants
        </button>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="flex items-center text-canopy-green hover:text-sage-mist transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Plants
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="bg-sage-mist hover:bg-opacity-90 text-cream-pulp px-4 py-2 rounded-button transition-all text-sm"
          >
            <i className="fas fa-edit mr-2"></i>Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-sun-bark hover:bg-opacity-90 text-cream-pulp px-4 py-2 rounded-button transition-all text-sm"
          >
            <i className="fas fa-trash mr-2"></i>Delete
          </button>
        </div>
      </div>

      {/* Plant Details Card */}
      <div className="bg-cream-pulp rounded-card shadow-subtle border border-lichen-veil/70 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Plant Image */}
          <div className="relative h-64 lg:h-auto">
            <img 
              src={plant.imageDataUrl || `https://picsum.photos/400/300?random=${plant.id}`}
              alt={plant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://picsum.photos/400/300?random=${plant.id}`;
              }}
            />
          </div>

          {/* Plant Information */}
          <div className="p-6 lg:p-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-canopy-green font-heading mb-2">
                  {plant.name}
                </h1>
                <p className="text-lg text-text-muted font-body">
                  {plant.species || 'Unknown Species'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>                  <span className="font-semibold text-canopy-green">Type:</span>
                  <p className="text-text-muted">{plant.plantType || 'Not specified'}</p>
                </div>
                <div>                  <span className="font-semibold text-canopy-green">Date Acquired:</span>
                  <p className="text-text-muted">{formatDate(plant.acquisitionDate)}</p>
                </div>                <div>
                  <span className="font-semibold text-canopy-green">Location:</span>
                  <p className="text-text-muted">Garden</p>
                </div>                <div>
                  <span className="font-semibold text-canopy-green">Size:</span>
                  <p className="text-text-muted">Medium</p>
                </div>
              </div>

              {plant.notes && (
                <div>
                  <span className="font-semibold text-canopy-green">Notes:</span>
                  <p className="text-text-muted mt-1 leading-relaxed">{plant.notes}</p>
                </div>
              )}              <div className="pt-4 border-t border-lichen-veil">
                <p className="text-xs text-text-muted">
                  Added on {formatDate(plant.acquisitionDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Comments Section */}
      <div className="bg-cream-pulp rounded-card shadow-subtle border border-lichen-veil/70 p-6">
        <h2 className="text-xl font-bold text-canopy-green font-heading mb-4">
          Care Notes & Comments
        </h2>
        <CommentBox 
          comments={plant.comments || []}
          onAddComment={(text: string) => {
            // TODO: Implement add comment functionality
            console.log('Add comment:', text);
          }}
        />
      </div>
    </div>
  );
};

export default PlantDetailViewWrapper;
