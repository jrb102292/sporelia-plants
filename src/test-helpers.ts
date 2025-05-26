import { nextId, deriveChildId, getPlantTypeFromId, isValidPlantId } from '../lib/plantIdHelpers';
import { Plant } from '../types';

// Test data
const testPlants: Plant[] = [
  {
    id: 'A-001',
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    plantType: 'Aroids',
    acquisitionDate: '2024-01-01',
    notes: 'First aroid'
  },
  {
    id: 'A-002',
    name: 'Pothos',
    species: 'Epipremnum aureum',
    plantType: 'Aroids',
    acquisitionDate: '2024-01-02',
    notes: 'Second aroid'
  },
  {
    id: 'C-001',
    name: 'Barrel Cactus',
    species: 'Ferocactus',
    plantType: 'Cacti',
    acquisitionDate: '2024-01-03',
    notes: 'First cactus'
  },
  {
    id: 'A-001-C01',
    name: 'Monstera Cutting',
    species: 'Monstera deliciosa',
    plantType: 'Aroids',
    acquisitionDate: '2024-01-04',
    notes: 'Cutting from A-001'
  }
];

// Test functions
console.log('=== Plant ID Helper Tests ===');

// Test nextId function
console.log('Next Aroid ID:', nextId(testPlants, 'Aroids')); // Should be A-003
console.log('Next Cacti ID:', nextId(testPlants, 'Cacti')); // Should be C-002
console.log('Next Orchid ID:', nextId(testPlants, 'Orchids')); // Should be O-001

// Test deriveChildId function
console.log('Child ID for A-001:', deriveChildId(testPlants, 'A-001')); // Should be A-001-C02
console.log('Child ID for C-001:', deriveChildId(testPlants, 'C-001')); // Should be C-001-C01

// Test validation
console.log('Valid A-001:', isValidPlantId('A-001')); // Should be true
console.log('Valid A-001-C01:', isValidPlantId('A-001-C01')); // Should be true
console.log('Invalid ID:', isValidPlantId('INVALID')); // Should be false

// Test type extraction
console.log('Type from A-001:', getPlantTypeFromId('A-001')); // Should be Aroids
console.log('Type from C-001:', getPlantTypeFromId('C-001')); // Should be Cacti

export {};
