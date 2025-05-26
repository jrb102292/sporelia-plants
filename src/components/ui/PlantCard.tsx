import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PlantCardProps {
  id: string;
  name: string;
  species: string;
  imageUrl?: string;
  category: string;
}

const PlantCard: React.FC<PlantCardProps> = ({ id, name, species, imageUrl, category }) => {
  return (
    <Link href={`/plants/${id}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="relative h-48 w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{species}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            {category}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PlantCard; 