import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant, Comment } from '../../types';
import FirebasePlantRepository from '../../lib/FirebasePlantRepository';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CommentBox from '../comments/CommentBox';
import { useModal } from '../../lib/ModalContext';

const PlantDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlant = async () => {
      if (!id) {
        setError('Plant ID is required');
        setLoading(false);
        return;
      }

      try {
        const foundPlant = await FirebasePlantRepository.getById(id);
        
        if (!foundPlant) {
          setError('Plant not found');
        } else {
          setPlant(foundPlant);
        }
      } catch (err) {
        setError('Error loading plant details');
        console.error('Error loading plant:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlant();
  }, [id]);

  const handleAddComment = async (text: string) => {
    if (!plant) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text,
      authorName: 'Plant Parent', // For local use, could be configurable
      createdAt: new Date().toISOString()
    };

    const updatedPlant: Plant = {
      ...plant,
      comments: [...(plant.comments || []), newComment]
    };

    try {
      await FirebasePlantRepository.save(updatedPlant);
      setPlant(updatedPlant);
    } catch (err) {
      console.error('Error saving comment:', err);
    }
  };

  const handleEdit = () => {
    if (plant) {
      openModal('plantForm', { plant, mode: 'edit' });
    }
  };

  const handleCreateCutting = () => {
    if (plant) {
      openModal('plantForm', { parentPlant: plant, mode: 'cutting' });
    }
  };

  const handleBackToCollection = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-canopy-green mb-4">
          {error || 'Plant not found'}
        </h2>
        <button
          onClick={handleBackToCollection}
          className="bg-canopy-green text-cream-pulp px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBackToCollection}
          className="flex items-center text-sage-mist hover:text-canopy-green transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Collection
        </button>
        <button
          onClick={handleEdit}
          className="bg-sun-bark text-cream-pulp px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
        >
          <i className="fas fa-edit mr-2"></i>
          Edit Plant
        </button>
        <button
          onClick={handleCreateCutting}
          className="bg-canopy-green text-cream-pulp px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
        >
          <i className="fas fa-scissors mr-2"></i>
          Create Cutting
        </button>
      </div>

      {/* Plant Details */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="space-y-4">
          {plant.imageDataUrl ? (
            <img
              src={plant.imageDataUrl}
              alt={plant.name}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-96 bg-lichen-veil/50 rounded-lg flex items-center justify-center">
              <i className="fas fa-seedling text-6xl text-sage-mist opacity-60"></i>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-canopy-green mb-2">{plant.name}</h1>
            <p className="text-xl text-sage-mist italic">{plant.species}</p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Plant Type
              </label>
              <p className="text-lg text-canopy-green">{plant.plantType}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Plant ID
              </label>
              <p className="text-lg font-mono text-canopy-green">{plant.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Acquired
              </label>
              <p className="text-lg text-canopy-green">
                {new Date(plant.acquisitionDate).toLocaleDateString()}
              </p>
            </div>

            {plant.lastWatered && (
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Last Watered
                </label>
                <p className="text-lg text-canopy-green">
                  {new Date(plant.lastWatered).toLocaleDateString()}
                </p>
              </div>
            )}

            {plant.parentPlantId && (
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  Parent Plant
                </label>
                <p className="text-lg text-canopy-green">{plant.parentPlantId}</p>
              </div>
            )}
          </div>

          {plant.notes && (
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                Notes
              </label>
              <p className="text-base text-canopy-green bg-cream-pulp p-4 rounded-md border border-lichen-veil">
                {plant.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12 pt-8 border-t border-lichen-veil">
        <h2 className="text-2xl font-bold text-canopy-green mb-4">Care Log</h2>
        <CommentBox
          comments={plant.comments || []}
          onAddComment={handleAddComment}
          className="max-w-2xl"
        />
      </div>
    </div>
  );
};

export default PlantDetailView;
