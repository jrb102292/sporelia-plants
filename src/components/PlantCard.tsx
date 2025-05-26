'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Plant } from '@/types';
import { DEFAULT_PLANT_IMAGE } from '@/constants';

interface PlantCardProps {
  plant: Plant;
  index: number;
}

export default function PlantCard({ plant, index }: PlantCardProps) {
  const imageUrl = plant.imageDataUrl || `${DEFAULT_PLANT_IMAGE}&id=${plant.id}`;
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-card shadow-subtle overflow-hidden flex flex-col border border-lichen-veil/70 h-full"
    >
      <div className="relative w-full h-52 overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={plant.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover" 
          style={{ filter: 'saturate(0.7)' }}
          onError={(e) => {
            // Fallback for image loading errors
            const target = e.target as HTMLImageElement;
            target.src = `${DEFAULT_PLANT_IMAGE}&id=${plant.id}_fallback`;
          }}
        />

        {/* Badge for plant type */}
        {plant.plantType && plant.plantType !== "Uncategorized" && (
          <span className="absolute top-3 right-3 text-xs font-medium bg-lichen-veil text-canopy-green px-2.5 py-1 rounded-full">
            {plant.plantType}
          </span>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-[var(--font-playfair)] font-semibold text-canopy-green mb-1">{plant.name}</h3>
        <p className="text-sm text-text-muted font-[var(--font-inter)] italic mb-2">{plant.species}</p>
        
        <div className="text-xs text-text-muted font-[var(--font-inter)] mb-3 space-y-0.5 mt-auto">
          <p><span className="inline-block w-5 text-center mr-1.5 opacity-70">🪴</span>Acquired: {formatDate(plant.acquisitionDate)}</p>
          {plant.lastWatered && (
            <p><span className="inline-block w-5 text-center mr-1.5 opacity-70 text-blue-500">💧</span>Last Watered: {formatDate(plant.lastWatered)}</p>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-lichen-veil/30">
          <Link 
            href={`/plants/${plant.id}`}
            className="text-sm font-medium text-canopy-green hover:underline"
          >
            View Details
          </Link>
          
          <div className="flex space-x-2">
            <button 
              className="p-1.5 rounded-full text-canopy-green hover:bg-lichen-veil/30 transition-colors"
              aria-label="Edit plant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete plant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
