'use client';

import { Plant } from '@/types';
import { DeleteButton } from './ui/DeleteButton';
import { plantRepository } from '@/lib/FirebasePlantRepository';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PlantCardProps {
  plant: Plant;
  onDelete?: () => void;
}

export function PlantCard({ plant, onDelete }: PlantCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await plantRepository.delete(plant.id);
      onDelete?.();
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

  return (
    <div 
      className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
      onClick={() => router.push(`/plants/${plant.id}`)}
    >
      {/* Delete button - only visible on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <DeleteButton onDelete={handleDelete} size="sm" />
      </div>

      {/* Plant image */}
      <div className="aspect-square bg-gray-100 relative">
        {plant.imageUrl ? (
          <Image 
            src={plant.imageUrl} 
            alt={plant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Plant info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{plant.name}</h3>
        <p className="text-sm text-gray-500">{plant.plantType}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${plant.status === 'Healthy' ? 'bg-green-100 text-green-800' :
              plant.status === 'Needs Attention' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}`}>
            {plant.status}
          </span>
          {plant.isCutting && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Cutting
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
