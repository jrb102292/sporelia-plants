'use client';

import React, { useState } from 'react';
import { Plant, PlantFormData, PlantFilters } from '@/types/plant';
import { plantService } from '@/services/plantService';
import PlantCard from '@/components/ui/PlantCard';
import PlantForm from '@/components/forms/PlantForm';

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>(plantService.getAll());
  const [filters, setFilters] = useState<PlantFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | undefined>();

  const handleFilterChange = (newFilters: PlantFilters) => {
    setFilters(newFilters);
    setPlants(plantService.filter(newFilters));
  };

  const handleAddPlant = (plantData: PlantFormData) => {
    const newPlant = plantService.create(plantData);
    setPlants(prev => [...prev, newPlant]);
    setIsFormOpen(false);
  };

  const handleUpdatePlant = (plantData: PlantFormData) => {
    if (!editingPlant) return;
    const updatedPlant = plantService.update(editingPlant.id, plantData);
    if (updatedPlant) {
      setPlants(prev => prev.map(p => p.id === updatedPlant.id ? updatedPlant : p));
    }
    setEditingPlant(undefined);
    setIsFormOpen(false);
  };

  const handleDeletePlant = (id: string) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      if (plantService.delete(id)) {
        setPlants(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Plants</h1>
        <button
          onClick={() => {
            setEditingPlant(undefined);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add Plant
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search plants..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        <select
          value={filters.category || ''}
          onChange={(e) => handleFilterChange({ ...filters, category: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="">All Categories</option>
          <option value="succulent">Succulent</option>
          <option value="fern">Fern</option>
          <option value="flowering">Flowering</option>
          <option value="foliage">Foliage</option>
        </select>
        <select
          value={filters.sortBy || ''}
          onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value as any })}
          className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="species">Species</option>
          <option value="category">Category</option>
          <option value="createdAt">Date Added</option>
        </select>
      </div>

      {/* Plant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plants.map((plant) => (
          <div key={plant.id} className="relative group">
            <PlantCard {...plant} />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditingPlant(plant);
                  setIsFormOpen(true);
                }}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePlant(plant.id)}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 ml-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plant Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingPlant ? 'Edit Plant' : 'Add New Plant'}
            </h2>
            <PlantForm
              initialData={editingPlant}
              onSubmit={editingPlant ? handleUpdatePlant : handleAddPlant}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingPlant(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
