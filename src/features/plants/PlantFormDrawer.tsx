
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { Plant, PlantFormData, PlantFormSchema } from '../../types';
import { useModal } from '../../lib/ModalContext';
import { usePlantStore, OPERATIONS } from '../../lib/PlantStoreContext';
import * as plantService from '../../lib/plantService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { startAsyncAction, successAsyncAction, errorAsyncAction } from '../../lib/plantStoreActions';

const PlantFormDrawer: React.FC = () => {
  const { closeModal, config } = useModal();
  const { state: plantState, dispatch: plantDispatch } = usePlantStore();
  
  // Determine form mode and relevant plant data
  const editingPlant = config?.type === 'plantForm' ? config.payload?.plant as Plant | null | undefined : null;
  const parentPlant = config?.type === 'plantForm' ? config.payload?.parentPlant as Plant | null | undefined : null;
  const formMode = config?.type === 'plantForm' ? config.payload?.mode || 'add' : 'add';
  
  const isEditing = formMode === 'edit' && !!editingPlant;
  const isCuttingMode = formMode === 'cutting' && !!parentPlant;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Initialize react-hook-form.
  // It handles form state, validation (via Zod), and submission.
  // No manual formRef is typically needed with react-hook-form for basic operations.
  const {
    register,
    handleSubmit, // react-hook-form's handleSubmit handles event.preventDefault()
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
    setValue
  } = useForm<PlantFormData>({
    resolver: zodResolver(PlantFormSchema),
    defaultValues: {
      name: '',
      species: '',
      plantType: 'Uncategorized',
      acquisitionDate: new Date().toISOString().split('T')[0],
      lastWatered: '', // Stored as string, Zod validates and can transform
      notes: '',
      imageDataUrl: '',
      parentPlantId: '',
      cuttingCount: 1,
    }
  });

  // Effect to populate form when editingPlant, parentPlant, or mode changes
  useEffect(() => {
    if (isEditing && editingPlant) {
      reset({
        name: editingPlant.name,
        species: editingPlant.species,
        plantType: editingPlant.plantType || 'Uncategorized',
        acquisitionDate: editingPlant.acquisitionDate ? new Date(editingPlant.acquisitionDate).toISOString().split('T')[0] : '',
        lastWatered: editingPlant.lastWatered ? new Date(editingPlant.lastWatered).toISOString().split('T')[0] : undefined,
        notes: editingPlant.notes || '',
        imageDataUrl: editingPlant.imageDataUrl || undefined,
        parentPlantId: editingPlant.parentPlantId || '',
        cuttingCount: 1,
      });
      setImagePreview(editingPlant.imageDataUrl || null);
    } else if (isCuttingMode && parentPlant) {
      // Pre-populate form for cutting mode with parent plant data
      reset({
        name: `${parentPlant.name} Cutting`,
        species: parentPlant.species,
        plantType: parentPlant.plantType || 'Uncategorized',
        acquisitionDate: new Date().toISOString().split('T')[0],
        lastWatered: undefined,
        notes: `Cutting taken from ${parentPlant.name}`,
        imageDataUrl: undefined,
        parentPlantId: parentPlant.id,
        cuttingCount: 1,
      });
      setImagePreview(null);
    } else {
      // Reset to default for a new plant form
      reset({
        name: '',
        species: '',
        plantType: 'Uncategorized',
        acquisitionDate: new Date().toISOString().split('T')[0],
        lastWatered: undefined,
        notes: '',
        imageDataUrl: undefined,
        parentPlantId: '',
        cuttingCount: 1,
      });
      setImagePreview(null);
    }
  }, [isEditing, editingPlant, isCuttingMode, parentPlant, reset]); // Dependencies for the effect

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError(null);
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setImageError("Image size should not exceed 2MB.");
        setImagePreview(null);
        setValue('imageDataUrl', undefined);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setImageError("Invalid file type. Please select JPG, PNG, WEBP, or GIF.");
        setImagePreview(null);
        setValue('imageDataUrl', undefined);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue('imageDataUrl', base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setValue('imageDataUrl', undefined);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue('imageDataUrl', undefined);
    const fileInput = document.getElementById('imageDataUrl-file') as HTMLInputElement; // Ensure ID matches input
    if (fileInput) fileInput.value = '';
    setImageError(null);
  };

  // Form submission handler, passed to react-hook-form's handleSubmit.
  const onSubmit: SubmitHandler<PlantFormData> = async (data) => {
    console.log('Form data submitted for processing:', data);
    if (plantState.isLoading) return; // Prevent multiple submissions

    // Prepare data for the service, ensuring type compatibility.
    const plantDataForService: Omit<Plant, 'id'> = {
      name: data.name,
      species: data.species,
      acquisitionDate: data.acquisitionDate,
      plantType: data.plantType, 
      notes: data.notes,
      imageDataUrl: data.imageDataUrl,
      lastWatered: data.lastWatered === null || data.lastWatered === '' ? undefined : data.lastWatered,
      parentPlantId: data.parentPlantId || undefined,
    };

    if (isEditing && editingPlant) {
      // Update plant using new action pattern
      plantDispatch(startAsyncAction(OPERATIONS.UPDATE_PLANT, editingPlant.id));
      try {
        const result = await plantService.updatePlant({ ...editingPlant, ...plantDataForService });
        if (result.data) {
          plantDispatch(successAsyncAction(OPERATIONS.UPDATE_PLANT, result.data, editingPlant.id));
          reset();
          closeModal();
        } else {
          plantDispatch(errorAsyncAction(OPERATIONS.UPDATE_PLANT, result.error || "Failed to update plant.", editingPlant.id));
        }
      } catch (error) {
        plantDispatch(errorAsyncAction(OPERATIONS.UPDATE_PLANT, "Failed to update plant.", editingPlant.id));
      }
    } else if (isCuttingMode && parentPlant && data.cuttingCount && data.cuttingCount > 1) {
      // Bulk cuttings mode using new action pattern
      plantDispatch(startAsyncAction(OPERATIONS.ADD_BULK_CUTTINGS, parentPlant.id));
      try {
        const result = await plantService.addBulkCuttings(parentPlant.id, plantDataForService, data.cuttingCount, plantState.plants);
        if (result.data) {
          plantDispatch(successAsyncAction(OPERATIONS.ADD_BULK_CUTTINGS, result.data, parentPlant.id));
          reset(); 
          setImagePreview(null);
          closeModal();
        } else {
          plantDispatch(errorAsyncAction(OPERATIONS.ADD_BULK_CUTTINGS, result.error || "Failed to add bulk cuttings.", parentPlant.id));
        }
      } catch (error) {
        plantDispatch(errorAsyncAction(OPERATIONS.ADD_BULK_CUTTINGS, "Failed to add bulk cuttings.", parentPlant.id));
      }
    } else if (isCuttingMode && parentPlant) {
      // Single cutting mode using new action pattern
      plantDispatch(startAsyncAction(OPERATIONS.ADD_PLANT, parentPlant.id));
      try {
        const result = await plantService.addCutting(parentPlant.id, plantDataForService, plantState.plants);
        if (result.data) {
          plantDispatch(successAsyncAction(OPERATIONS.ADD_PLANT, result.data, result.data.id));
          reset(); 
          setImagePreview(null); 
          closeModal();
        } else {
          plantDispatch(errorAsyncAction(OPERATIONS.ADD_PLANT, result.error || "Failed to add cutting.", parentPlant.id));
        }
      } catch (error) {
        plantDispatch(errorAsyncAction(OPERATIONS.ADD_PLANT, "Failed to add cutting.", parentPlant.id));
      }
    } else {
      // Regular plant addition using new action pattern
      plantDispatch(startAsyncAction(OPERATIONS.ADD_PLANT));
      try {
        const result = await plantService.addPlant(plantDataForService);
        if (result.data) {
          plantDispatch(successAsyncAction(OPERATIONS.ADD_PLANT, result.data, result.data.id));
          reset(); 
          setImagePreview(null); 
          closeModal();
        } else {
          plantDispatch(errorAsyncAction(OPERATIONS.ADD_PLANT, result.error || "Failed to add plant."));
        }
      } catch (error) {
        plantDispatch(errorAsyncAction(OPERATIONS.ADD_PLANT, "Failed to add plant."));
      }
    }
  };
  
  // Combined loading state from global store and react-hook-form.
  const isLoading = plantState.isLoading || isFormSubmitting;

  return (
    // Radix Dialog.Content provides the drawer structure and accessibility features.
    <Dialog.Content 
      className="fixed right-0 top-0 h-full w-full max-w-md bg-cream-pulp shadow-xl flex flex-col animate-slideInRight z-[60]"
      onEscapeKeyDown={(e) => { if (!isLoading) closeModal(); else e.preventDefault(); }} // Prevent closing if loading
      onInteractOutside={(e) => { if (!isLoading) closeModal(); else e.preventDefault(); }} // Prevent closing if loading
    >
      <div className="flex justify-between items-center p-6 border-b border-lichen-veil">
        <Dialog.Title className="text-2xl font-heading font-semibold text-canopy-green">
          {isEditing ? 'Edit Plant' : isCuttingMode ? 'Create Cutting' : 'Add New Plant'}
        </Dialog.Title>
        <Dialog.Close asChild>
          <button 
            className="text-sage-mist hover:text-canopy-green text-2xl p-1 rounded-button focus:outline-none focus-style" 
            aria-label="Close"
            onClick={() => !isLoading && closeModal()} // Prevent closing if loading
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </Dialog.Close>
      </div>

      {/* The form element itself. react-hook-form's handleSubmit is used. */}
      <form 
        id="plant-form-drawer" 
        data-testid="plant-form-drawer"
        onSubmit={handleSubmit(onSubmit)} 
        className="flex-grow overflow-y-auto p-6 space-y-6"
      >
        {/* Image Upload */}
        <div>
          <label htmlFor="imageDataUrl-file" className="block text-sm font-medium text-canopy-green mb-1">Plant Image</label>
          {imagePreview ? (
            <div className="relative group">
              <img src={imagePreview} alt="Plant preview" className="w-full h-48 object-cover rounded-md border border-lichen-veil" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                aria-label="Remove image"
              >
                <i className="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          ) : (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-lichen-veil border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <i className="fas fa-image text-4xl text-lichen-veil mx-auto"></i>
                <div className="flex text-sm text-sage-mist">
                  <label
                    htmlFor="imageDataUrl-file" // This label points to the actual file input
                    className="relative cursor-pointer bg-cream-pulp rounded-md font-medium text-canopy-green hover:text-sage-mist focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sun-bark"
                  >
                    <span>Upload a file</span>
                    {/* Actual file input, visually hidden but accessible */}
                    <input id="imageDataUrl-file" name="imageDataUrlFile" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif, image/webp" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-text-muted">PNG, JPG, GIF, WEBP up to 2MB</p>
              </div>
            </div>
          )}
          {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
          {/* Hidden input registered with RHF to store base64 image data */}
          <input type="hidden" {...register('imageDataUrl')} />
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-canopy-green">Name <span className="text-red-500">*</span></label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`mt-1 block w-full px-3 py-2 bg-cream-pulp border ${errors.name ? 'border-red-500' : 'border-lichen-veil'} rounded-button shadow-sm focus:outline-none focus:ring-sage-mist focus:border-sage-mist sm:text-sm placeholder-text-muted/70`}
            placeholder="e.g., Freddy the Fiddle Leaf"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && <p className="mt-2 text-sm text-red-600" role="alert">{errors.name.message}</p>}
        </div>

        {/* Species Field */}
        <div>
          <label htmlFor="species" className="block text-sm font-medium text-canopy-green">Species <span className="text-red-500">*</span></label>
          <input
            id="species"
            type="text"
            {...register('species')}
            className={`mt-1 block w-full px-3 py-2 bg-cream-pulp border ${errors.species ? 'border-red-500' : 'border-lichen-veil'} rounded-button shadow-sm focus:outline-none focus:ring-sage-mist focus:border-sage-mist sm:text-sm placeholder-text-muted/70`}
            placeholder="e.g., Ficus lyrata"
            aria-invalid={errors.species ? "true" : "false"}
          />
          {errors.species && <p className="mt-2 text-sm text-red-600" role="alert">{errors.species.message}</p>}
        </div>
        
        {/* Plant Type Field */}
        <div>
          <label htmlFor="plantType" className="block text-sm font-medium text-canopy-green">Plant Type</label>
          <input
            id="plantType"
            type="text"
            {...register('plantType')}
            list="plant-types-datalist"
            className={`mt-1 block w-full px-3 py-2 bg-cream-pulp border ${errors.plantType ? 'border-red-500' : 'border-lichen-veil'} rounded-button shadow-sm focus:outline-none focus:ring-sage-mist focus:border-sage-mist sm:text-sm placeholder-text-muted/70`}
            placeholder="e.g., Fiddle Leaf Fig (defaults to Uncategorized)"
            aria-invalid={errors.plantType ? "true" : "false"}
          />
          <datalist id="plant-types-datalist">
            <option value="Alocasia" />
            <option value="Philodendron" />
            <option value="Monstera" />
            <option value="Calathea" />
            <option value="Hoya" />
            <option value="Fern" />
            <option value="Succulent" />
            <option value="Cactus" />
            <option value="Ficus" />
            <option value="Pothos" />
            <option value="Orchid" />
            <option value="Uncategorized" />
          </datalist>
          {errors.plantType && <p className="mt-2 text-sm text-red-600" role="alert">{errors.plantType.message}</p>}
        </div>

        {/* Cutting Count Field - Only show in cutting mode */}
        {isCuttingMode && (
          <div>
            <label htmlFor="cuttingCount" className="block text-sm font-medium text-canopy-green">Number of Cuttings</label>
            <input
              id="cuttingCount"
              type="number"
              min="1"
              max="10"
              {...register('cuttingCount', { valueAsNumber: true })}
              className={`mt-1 block w-full px-3 py-2 bg-cream-pulp border ${errors.cuttingCount ? 'border-red-500' : 'border-lichen-veil'} rounded-button shadow-sm focus:outline-none focus:ring-sage-mist focus:border-sage-mist sm:text-sm placeholder-text-muted/70`}
              placeholder="1"
              aria-invalid={errors.cuttingCount ? "true" : "false"}
            />
            <p className="mt-1 text-xs text-sage-mist">Create multiple cuttings at once (1-10)</p>
            {errors.cuttingCount && <p className="mt-2 text-sm text-red-600" role="alert">{errors.cuttingCount.message}</p>}
          </div>
        )}

        {/* Acquisition Date Field */}
        <div>
          <label htmlFor="acquisitionDate" className="block text-sm font-medium text-canopy-green">Acquisition Date <span className="text-red-500">*</span></label>
          <input
            id="acquisitionDate"
            type="date"
            {...register('acquisitionDate')}
            className={`mt-1 block w-full px-3 py-2 bg-cream-pulp border ${errors.acquisitionDate ? 'border-red-500' : 'border-lichen-veil'} rounded-button shadow-sm focus:outline-none focus:ring-sage-mist focus:border-sage-mist sm:text-sm text-canopy-green`}
            aria-invalid={errors.acquisitionDate ? "true" : "false"}
          />
          {errors.acquisitionDate && <p className="mt-2 text-sm text-red-600" role="alert">{errors.acquisitionDate.message}</p>}
        </div>

        {/* Last Watered Date Field */}
        <div>
          <label htmlFor="lastWatered" className="block text-sm font-medium text-canopy-green">Last Watered Date</label>
          <input
            id="lastWatered"
            type="date"
            {...register('lastWatered')}
            className={`mt-1 block w-full px-3 py-2 bg-cream-pulp border ${errors.lastWatered ? 'border-red-500' : 'border-lichen-veil'} rounded-button shadow-sm focus:outline-none focus:ring-sage-mist focus:border-sage-mist sm:text-sm text-canopy-green`}
            aria-invalid={errors.lastWatered ? "true" : "false"}
          />
          {errors.lastWatered && <p className="mt-2 text-sm text-red-600" role="alert">{errors.lastWatered.message}</p>}
        </div>

        {/* Notes Field */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-canopy-green">Notes</label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            className={`mt-1 block w-full px-3 py-2 bg-cream-pulp border ${errors.notes ? 'border-red-500' : 'border-lichen-veil'} rounded-button shadow-sm focus:outline-none focus:ring-sage-mist focus:border-sage-mist sm:text-sm placeholder-text-muted/70`}
            placeholder="Any special care instructions or observations..."
            aria-invalid={errors.notes ? "true" : "false"}
          />
          {errors.notes && <p className="mt-2 text-sm text-red-600" role="alert">{errors.notes.message}</p>}
        </div>
      </form>

      {/* Drawer Footer with Action Buttons */}
      <div className="p-6 border-t border-lichen-veil bg-cream-pulp">
        {plantState.error && !isLoading && (
            <p className="mb-3 text-sm text-red-600 text-center" role="alert">Error: {plantState.error}</p>
        )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => !isLoading && closeModal()} // Prevent closing if loading
            disabled={isLoading}
            className="px-4 py-2.5 border border-sage-mist text-sage-mist rounded-button font-medium hover:bg-sage-mist hover:text-cream-pulp transition-colors duration-200 ease-out focus:outline-none focus-style disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit" // This button submits the form
            form="plant-form-drawer" // Associates with the form via its ID
            disabled={isLoading}
            className="px-6 py-2.5 bg-canopy-green text-cream-pulp rounded-button font-medium hover:bg-opacity-90 transition-colors duration-200 ease-out focus:outline-none focus-style disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="w-5 h-5" color="border-cream-pulp" />
                <span className="ml-2">{isEditing ? 'Saving...' : 'Adding...'}</span>
              </>
            ) : (isEditing ? 'Save Changes' : 'Add Plant')}
          </button>
        </div>
      </div>
    </Dialog.Content>
  );
};

export default PlantFormDrawer;