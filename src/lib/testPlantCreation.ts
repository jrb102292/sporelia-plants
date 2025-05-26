// Quick test script to verify plant creation works with Firebase
import { addPlant } from './plantService';
import { Plant } from '../types';

export async function testPlantCreation() {
  console.log('🧪 Testing plant creation...');
  
  const testPlant: Omit<Plant, 'id'> = {
    name: 'Test Monstera',
    plantType: 'Aroids',
    location: 'Living Room',
    status: 'Healthy',
    wateringSchedule: 'Weekly',
    acquisitionDate: new Date().toISOString().split('T')[0],
    lastWatered: new Date().toISOString().split('T')[0],
    notes: 'Test plant for Firebase verification'
  };

  try {
    console.log('📝 Creating test plant:', testPlant);
    const result = await addPlant(testPlant);
    
    if (result.data) {
      console.log('✅ Plant created successfully!');
      console.log('🆔 Firebase assigned ID:', result.data.id);
      console.log('🌱 Plant data:', result.data);
      return result.data;
    } else {
      console.error('❌ Failed to create plant:', result.error);
      return null;
    }
  } catch (error) {
    console.error('💥 Error during plant creation:', error);
    return null;
  }
}

// Export for use in browser console
(window as any).testPlantCreation = testPlantCreation;
