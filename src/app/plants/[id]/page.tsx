'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plant, PlantStatus, isPlant } from '@/types/plant';
import { plantRepository } from '@/lib/FirebasePlantRepository';
import { DeleteButton } from '@/components/ui/DeleteButton';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PlantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loadPlant = async () => {
      try {
        const plantData = await plantRepository.findById(params.id);
        if (plantData && isPlant(plantData)) {
          setPlant(plantData);
        } else {
          setError('Invalid plant data received');
        }
      } catch (err) {
        setError('Failed to load plant details');
        console.error('Error loading plant:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlant();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      await plantRepository.delete(params.id);
      router.push('/plants');
    } catch (err) {
      setError('Failed to delete plant');
      console.error('Error deleting plant:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !plant) {
    return (
      <>
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error || 'Plant not found'}</p>
              <button
                onClick={() => router.push('/plants')}
                className="mt-4 text-sm text-red-600 hover:text-red-800"
              >
                Return to Plants
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status: PlantStatus) => {
    switch (status) {
      case 'Healthy':
        return 'text-green-600';
      case 'Needs Attention':
        return 'text-yellow-600';
      case 'Unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Header with delete button */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{plant.name}</h1>
                <p className="mt-1 text-sm text-gray-500">{plant.plantType}</p>
              </div>
              <DeleteButton onDelete={handleDelete} size="md" />
            </div>

            {/* Plant image */}
            <div className="relative h-64 sm:h-96 bg-gray-100">
              {plant.imageUrl ? (
                <Image
                  src={plant.imageUrl}
                  alt={plant.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Plant details */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className={`mt-1 text-sm font-medium ${getStatusColor(plant.status)}`}>
                    {plant.status}
                  </p>
                </div>
                {plant.isCutting && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p className="mt-1 text-sm text-blue-600">Cutting</p>
                  </div>
                )}
                {plant.acquisitionDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Acquired</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(plant.acquisitionDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {plant.lastWatered && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Watered</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(plant.lastWatered).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {plant.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{plant.notes}</p>
                </div>
              )}

              {plant.careInstructions && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Care Instructions</h3>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{plant.careInstructions}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
