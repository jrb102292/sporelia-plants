'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plant } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FirebasePlantRepository from '@/lib/FirebasePlantRepository';
import Plant3DVisualizer from '@/components/Plant3DVisualizer';
import { FADE_IN_ANIMATION, STAGGER_CHILDREN } from '@/constants';
import Link from 'next/link';
import Image from 'next/image';

export default function PlantPage({ params }: { params: { id: string } }) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWateringUpdated, setIsWateringUpdated] = useState(false);
  const plant3DRef = useRef<{ triggerWateringAnimation: () => void } | null>(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        setIsLoading(true);
        const plantData = await FirebasePlantRepository.getById(params.id);
        
        if (!plantData) {
          setError('Plant not found');
          return;
        }
        
        setPlant(plantData);
      } catch (err) {
        console.error('Error fetching plant:', err);
        setError('Failed to load plant details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlant();
  }, [params.id, isWateringUpdated]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not recorded';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  const recordWatering = async () => {
    if (!plant) return;
    
    try {
      setIsLoading(true);
      
      // Trigger the 3D watering animation if available
      if (plant3DRef.current?.triggerWateringAnimation) {
        plant3DRef.current.triggerWateringAnimation();
      }
      
      // Update the plant with today's date as the last watered date
      const today = new Date().toISOString().split('T')[0];
      const updatedPlant = {
        ...plant,
        lastWatered: today
      };
      
      // Save to Firebase
      await FirebasePlantRepository.save(updatedPlant);
      
      // Trigger a refresh
      setIsWateringUpdated(prev => !prev);
      
    } catch (err) {
      console.error('Error recording watering:', err);
      setError('Failed to record watering. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysSinceLastWatered = (lastWateredDate?: string) => {
    if (!lastWateredDate) return null;
    
    const lastWatered = new Date(lastWateredDate);
    const today = new Date();
    const diffTime = today.getTime() - lastWatered.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 sm:p-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CHILDREN}
          className="max-w-6xl mx-auto"
        >
          {/* Breadcrumb */}
          <motion.div 
            className="mb-6 flex items-center text-sm text-text-muted"
            variants={FADE_IN_ANIMATION}
          >
            <Link href="/plants" className="hover:text-canopy-green">Plants</Link>
            <span className="mx-2">/</span>
            <span className="text-canopy-green font-medium">
              {isLoading ? 'Loading...' : plant?.name || 'Plant Details'}
            </span>
          </motion.div>

          {/* Loading state */}
          {isLoading && (
            <motion.div 
              className="flex justify-center py-12"
              variants={FADE_IN_ANIMATION}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-canopy-green"></div>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <motion.div 
              className="bg-red-50 text-red-600 p-6 rounded-lg"
              variants={FADE_IN_ANIMATION}
            >
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p>{error}</p>
              <Link 
                href="/plants" 
                className="inline-block mt-4 text-red-700 hover:underline"
              >
                Return to plant collection
              </Link>
            </motion.div>
          )}

          {/* Plant details */}
          {!isLoading && plant && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Plant image and 3D visualization */}
              <motion.div variants={FADE_IN_ANIMATION}>
                {/* Plant image */}
                {plant.imageDataUrl && (
                  <div className="relative w-full h-80 mb-6 rounded-card overflow-hidden shadow-md">
                    <Image
                      src={plant.imageDataUrl}
                      alt={plant.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                  {/* 3D visualization */}
                <Plant3DVisualizer plant={plant} ref={plant3DRef} />
              </motion.div>
              
              {/* Right column - Plant details */}
              <motion.div 
                className="bg-white/70 backdrop-blur-sm p-8 rounded-card shadow-subtle border border-lichen-veil/30"
                variants={FADE_IN_ANIMATION}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-canopy-green font-[var(--font-playfair)]">
                      {plant.name}
                    </h1>
                    <p className="text-lg italic text-text-muted mt-1">{plant.species}</p>
                  </div>
                  
                  {plant.plantType && plant.plantType !== "Uncategorized" && (
                    <span className="text-xs font-medium bg-lichen-veil text-canopy-green px-2.5 py-1 rounded-full">
                      {plant.plantType}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h2 className="text-sm uppercase tracking-wider text-text-muted mb-2">Acquired On</h2>
                    <p className="font-medium">{formatDate(plant.acquisitionDate)}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-sm uppercase tracking-wider text-text-muted mb-2">Last Watered</h2>
                    <p className="font-medium">
                      {plant.lastWatered ? formatDate(plant.lastWatered) : 'Not recorded'}
                    </p>
                    {plant.lastWatered && (
                      <p className="text-sm mt-1">
                        <span className={`${
                          getDaysSinceLastWatered(plant.lastWatered)! > 7 
                            ? 'text-red-500' 
                            : 'text-canopy-green'
                        }`}>
                          {getDaysSinceLastWatered(plant.lastWatered)} days ago
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                
                {plant.notes && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-canopy-green mb-2">Notes</h2>
                    <p className="text-text-muted whitespace-pre-line">{plant.notes}</p>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-4 mt-8">
                  <Link
                    href={`/plants/${plant.id}/edit`}
                    className="flex-1 py-2 px-4 bg-lichen-veil text-canopy-green font-medium rounded-button text-center hover:bg-lichen-veil/70 transition-colors"
                  >
                    Edit Plant
                  </Link>                  <motion.button
                    onClick={recordWatering}
                    className="flex-1 py-2 px-4 bg-white border border-lichen-veil/50 text-canopy-green font-medium rounded-button text-center hover:bg-lichen-veil/10 transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Record Watering
                  </motion.button>
                </div>
              </motion.div>
            </div>          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
