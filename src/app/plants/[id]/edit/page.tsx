'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlantFormSchema, PlantFormData } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FirebasePlantRepository from '@/lib/FirebasePlantRepository';
import ImageUploadService from '@/lib/ImageUploadService';
import { FADE_IN_ANIMATION, STAGGER_CHILDREN } from '@/constants';
import Link from 'next/link';

export default function EditPlantPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<PlantFormData>({
    resolver: zodResolver(PlantFormSchema),
  });
  
  // Fetch plant data
  useEffect(() => {
    async function fetchPlant() {
      try {
        setIsLoading(true);
        const plant = await FirebasePlantRepository.getById(params.id);
        
        if (!plant) {
          setError('Plant not found');
          return;
        }
        
        // Set form values
        reset({
          name: plant.name,
          species: plant.species,
          acquisitionDate: plant.acquisitionDate,
          lastWatered: plant.lastWatered || '',
          notes: plant.notes || '',
          plantType: plant.plantType || 'Uncategorized',
          imageDataUrl: plant.imageDataUrl || '',
        });
        
        // Set image preview if exists
        if (plant.imageDataUrl) {
          setImagePreview(plant.imageDataUrl);
        }
        
      } catch (err) {
        console.error('Error fetching plant:', err);
        setError('Failed to load plant data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPlant();
  }, [params.id, reset]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!ImageUploadService.validateImageFile(file)) {
      return;
    }
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
        setValue('imageDataUrl', event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const onSubmit = async (data: PlantFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create updated plant object
      const updatedPlant = {
        id: params.id,
        name: data.name,
        species: data.species,
        acquisitionDate: data.acquisitionDate,
        lastWatered: data.lastWatered || undefined,
        notes: data.notes,
        plantType: data.plantType,
        imageDataUrl: data.imageDataUrl,
      };
      
      // Save to Firebase
      await FirebasePlantRepository.save(updatedPlant);
      
      // Navigate to the plant detail page
      router.push(`/plants/${params.id}`);
    } catch (err) {
      console.error('Error updating plant:', err);
      setError('Failed to update plant. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen p-6 sm:p-8 flex items-center justify-center">
          <div className="animate-pulse text-canopy-green">Loading plant data...</div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 sm:p-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CHILDREN}
          className="max-w-3xl mx-auto"
        >
          {/* Breadcrumb */}
          <motion.div 
            className="mb-6 flex items-center text-sm text-text-muted"
            variants={FADE_IN_ANIMATION}
          >
            <Link href="/plants" className="hover:text-canopy-green">Plants</Link>
            <span className="mx-2">/</span>
            <Link href={`/plants/${params.id}`} className="hover:text-canopy-green">
              {watch('name') || 'Plant Details'}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-canopy-green font-medium">Edit</span>
          </motion.div>
          
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-card shadow-subtle border border-lichen-veil/30 p-8"
            variants={FADE_IN_ANIMATION}
          >
            <h1 className="text-3xl font-bold text-canopy-green font-[var(--font-playfair)] mb-6">
              Edit Plant
            </h1>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name & Species */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-canopy-green mb-1">
                    Plant Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full py-2 px-4 rounded-lg border border-lichen-veil/50 focus:ring-1 focus:ring-canopy-green focus:border-canopy-green"
                    placeholder="E.g., Monstera Delilah"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="species" className="block text-sm font-medium text-canopy-green mb-1">
                    Species*
                  </label>
                  <input
                    type="text"
                    id="species"
                    {...register('species')}
                    className="w-full py-2 px-4 rounded-lg border border-lichen-veil/50 focus:ring-1 focus:ring-canopy-green focus:border-canopy-green"
                    placeholder="E.g., Monstera Deliciosa"
                  />
                  {errors.species && (
                    <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>
                  )}
                </div>
              </div>
              
              {/* Plant Type & Acquisition Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="plantType" className="block text-sm font-medium text-canopy-green mb-1">
                    Plant Type
                  </label>
                  <input
                    type="text"
                    id="plantType"
                    {...register('plantType')}
                    className="w-full py-2 px-4 rounded-lg border border-lichen-veil/50 focus:ring-1 focus:ring-canopy-green focus:border-canopy-green"
                    placeholder="E.g., Alocasia, Philodendron"
                  />
                  {errors.plantType && (
                    <p className="mt-1 text-sm text-red-600">{errors.plantType.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="acquisitionDate" className="block text-sm font-medium text-canopy-green mb-1">
                    Acquisition Date*
                  </label>
                  <input
                    type="date"
                    id="acquisitionDate"
                    {...register('acquisitionDate')}
                    className="w-full py-2 px-4 rounded-lg border border-lichen-veil/50 focus:ring-1 focus:ring-canopy-green focus:border-canopy-green"
                  />
                  {errors.acquisitionDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.acquisitionDate.message}</p>
                  )}
                </div>
              </div>
              
              {/* Last Watered */}
              <div>
                <label htmlFor="lastWatered" className="block text-sm font-medium text-canopy-green mb-1">
                  Last Watered (Optional)
                </label>
                <input
                  type="date"
                  id="lastWatered"
                  {...register('lastWatered')}
                  className="w-full py-2 px-4 rounded-lg border border-lichen-veil/50 focus:ring-1 focus:ring-canopy-green focus:border-canopy-green"
                />
                {errors.lastWatered && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastWatered.message}</p>
                )}
              </div>
              
              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-canopy-green mb-1">
                  Care Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  rows={4}
                  className="w-full py-2 px-4 rounded-lg border border-lichen-veil/50 focus:ring-1 focus:ring-canopy-green focus:border-canopy-green"
                  placeholder="Add any care instructions or notes about your plant..."
                ></textarea>
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                )}
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-canopy-green mb-1">
                  Plant Image (Optional)
                </label>
                
                <div className="flex items-center gap-4">
                  <label 
                    htmlFor="imageUpload"
                    className="cursor-pointer bg-lichen-veil/30 hover:bg-lichen-veil/50 text-canopy-green py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    {imagePreview ? 'Change Image' : 'Select Image'}
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <input type="hidden" {...register('imageDataUrl')} />
                  
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Plant preview" 
                        className="h-16 w-16 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setValue('imageDataUrl', '');
                        }}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Submit button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 bg-canopy-green text-white font-medium rounded-button 
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Plant...
                    </span>
                  ) : 'Save Changes'}
                </button>
                
                <Link
                  href={`/plants/${params.id}`}
                  className="flex-1 py-3 border border-lichen-veil/50 text-text-muted font-medium rounded-button text-center hover:bg-lichen-veil/10 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
