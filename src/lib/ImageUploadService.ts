// Firebase Storage service for plant images
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export class ImageUploadService {
  
  /**
   * Upload plant image to Firebase Storage
   * @param file Image file to upload
   * @param plantId Plant ID for organizing images
   * @returns Promise<string> Download URL of uploaded image
   */
  async uploadPlantImage(file: File, plantId: string): Promise<string> {
    try {
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const fileName = `${plantId}_${timestamp}_${file.name}`;
      const imageRef = ref(storage, `plants/${fileName}`);
      
      // Upload file
      const snapshot = await uploadBytes(imageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading plant image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Delete plant image from Firebase Storage
   * @param imageUrl Full URL of the image to delete
   */
  async deletePlantImage(imageUrl: string): Promise<void> {
    try {
      // Extract path from URL
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting plant image:', error);
      // Don't throw error - image might already be deleted
    }
  }

  /**
   * Validate image file before upload
   * @param file File to validate
   * @returns boolean True if valid
   */
  validateImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      console.error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      return false;
    }
    
    if (file.size > maxSize) {
      console.error('File too large. Maximum size is 5MB.');
      return false;
    }
    
    return true;
  }
}

export default new ImageUploadService();
