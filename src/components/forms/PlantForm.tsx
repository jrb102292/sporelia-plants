import React from 'react';
import { PlantFormData } from '@/types/plant';

interface PlantFormProps {
  initialData?: PlantFormData;
  onSubmit: (data: PlantFormData) => void;
  onCancel: () => void;
}

const PlantForm: React.FC<PlantFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<PlantFormData>({
    name: '',
    species: '',
    category: '',
    description: '',
    careInstructions: {
      watering: '',
      sunlight: '',
      temperature: '',
      humidity: '',
    },
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('care.')) {
      const careField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        careInstructions: {
          ...prev.careInstructions!,
          [careField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="species" className="block text-sm font-medium text-gray-700">
          Species
        </label>
        <input
          type="text"
          id="species"
          name="species"
          value={formData.species}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="">Select a category</option>
          <option value="succulent">Succulent</option>
          <option value="fern">Fern</option>
          <option value="flowering">Flowering</option>
          <option value="foliage">Foliage</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Care Instructions</h3>
        
        <div>
          <label htmlFor="care.watering" className="block text-sm font-medium text-gray-700">
            Watering
          </label>
          <input
            type="text"
            id="care.watering"
            name="care.watering"
            value={formData.careInstructions?.watering}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="care.sunlight" className="block text-sm font-medium text-gray-700">
            Sunlight
          </label>
          <input
            type="text"
            id="care.sunlight"
            name="care.sunlight"
            value={formData.careInstructions?.sunlight}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="care.temperature" className="block text-sm font-medium text-gray-700">
            Temperature
          </label>
          <input
            type="text"
            id="care.temperature"
            name="care.temperature"
            value={formData.careInstructions?.temperature}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="care.humidity" className="block text-sm font-medium text-gray-700">
            Humidity
          </label>
          <input
            type="text"
            id="care.humidity"
            name="care.humidity"
            value={formData.careInstructions?.humidity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {initialData ? 'Update Plant' : 'Add Plant'}
        </button>
      </div>
    </form>
  );
};

export default PlantForm; 