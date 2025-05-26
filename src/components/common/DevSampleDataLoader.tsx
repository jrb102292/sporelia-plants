import React from 'react';
import { Plant } from '../types';

const DevSampleDataLoader: React.FC = () => {
  const loadSampleData = () => {
    const samplePlants: Plant[] = [
      // Monsteras
      { id: 'M-001', name: 'Monstera Deliciosa', species: 'Monstera deliciosa', acquisitionDate: '2024-01-15', plantType: 'Monstera', notes: 'Beautiful fenestrated leaves, getting quite large!' },
      { id: 'M-002', name: 'Monstera Adansonii', species: 'Monstera adansonii', acquisitionDate: '2024-02-10', plantType: 'Monstera', notes: 'Swiss cheese plant with lovely holes' },
      { id: 'M-003', name: 'Monstera Borsigiana', species: 'Monstera deliciosa var. borsigiana', acquisitionDate: '2024-03-05', plantType: 'Monstera', notes: 'Faster growing variety' },
      { id: 'M-004', name: 'Monstera Thai Constellation', species: 'Monstera deliciosa Thai Constellation', acquisitionDate: '2024-01-20', plantType: 'Monstera', notes: 'Expensive but gorgeous variegation!' },
      { id: 'M-005', name: 'Monstera Pinnatipartita', species: 'Monstera pinnatipartita', acquisitionDate: '2024-04-12', plantType: 'Monstera', notes: 'Rare species with unique leaf shape' },

      // Alocasias
      { id: 'A-001', name: 'Alocasia Zebrina', species: 'Alocasia zebrina', acquisitionDate: '2024-01-08', plantType: 'Alocasia', notes: 'Stunning striped petioles' },
      { id: 'A-002', name: 'Alocasia Polly', species: 'Alocasia × amazonica', acquisitionDate: '2024-02-14', plantType: 'Alocasia', notes: 'Classic houseplant with dark green leaves' },
      { id: 'A-003', name: 'Alocasia Regal Shield', species: 'Alocasia × Regal Shield', acquisitionDate: '2024-03-20', plantType: 'Alocasia', notes: 'Large dramatic leaves' },
      { id: 'A-004', name: 'Alocasia Dragon Scale', species: 'Alocasia baginda Dragon Scale', acquisitionDate: '2024-01-30', plantType: 'Alocasia', notes: 'Textured leaves like dragon scales' },
      { id: 'A-005', name: 'Alocasia Stingray', species: 'Alocasia macrorrhiza Stingray', acquisitionDate: '2024-04-05', plantType: 'Alocasia', notes: 'Leaves shaped like stingrays' },
      { id: 'A-006', name: 'Alocasia Frydek', species: 'Alocasia micholitziana Frydek', acquisitionDate: '2024-02-28', plantType: 'Alocasia', notes: 'Velvety dark green leaves' },

      // Philodendrons
      { id: 'P-001', name: 'Heartleaf Philodendron', species: 'Philodendron hederaceum', acquisitionDate: '2024-01-05', plantType: 'Philodendron', notes: 'Easy trailing plant, great for beginners' },
      { id: 'P-002', name: 'Philodendron Brasil', species: 'Philodendron hederaceum Brasil', acquisitionDate: '2024-02-18', plantType: 'Philodendron', notes: 'Variegated version with lime green stripes' },
      { id: 'P-003', name: 'Philodendron Pink Princess', species: 'Philodendron erubescens Pink Princess', acquisitionDate: '2024-03-12', plantType: 'Philodendron', notes: 'Gorgeous pink variegation' },
      { id: 'P-004', name: 'Philodendron Micans', species: 'Philodendron hederaceum var. hederaceum', acquisitionDate: '2024-01-25', plantType: 'Philodendron', notes: 'Velvety bronze-green leaves' },
      { id: 'P-005', name: 'Philodendron White Wizard', species: 'Philodendron erubescens White Wizard', acquisitionDate: '2024-04-08', plantType: 'Philodendron', notes: 'Stunning white variegation' },
      { id: 'P-006', name: 'Philodendron Gloriosum', species: 'Philodendron gloriosum', acquisitionDate: '2024-02-22', plantType: 'Philodendron', notes: 'Crawling philodendron with white veins' },
      { id: 'P-007', name: 'Philodendron Birkin', species: 'Philodendron Birkin', acquisitionDate: '2024-03-15', plantType: 'Philodendron', notes: 'White pinstripes on dark green leaves' },

      // Pothos
      { id: 'PO-001', name: 'Golden Pothos', species: 'Epipremnum aureum', acquisitionDate: '2024-01-12', plantType: 'Pothos', notes: 'Classic golden variegation' },
      { id: 'PO-002', name: 'Marble Queen Pothos', species: 'Epipremnum aureum Marble Queen', acquisitionDate: '2024-02-08', plantType: 'Pothos', notes: 'Heavy white variegation' },
      { id: 'PO-003', name: 'Neon Pothos', species: 'Epipremnum aureum Neon', acquisitionDate: '2024-03-22', plantType: 'Pothos', notes: 'Bright chartreuse leaves' },
      { id: 'PO-004', name: 'Manjula Pothos', species: 'Epipremnum aureum Manjula', acquisitionDate: '2024-01-18', plantType: 'Pothos', notes: 'Unique cream and green variegation' },
      { id: 'PO-005', name: 'Baltic Blue Pothos', species: 'Epipremnum pinnatum Baltic Blue', acquisitionDate: '2024-04-01', plantType: 'Pothos', notes: 'Fenestrated pothos variety' },

      // Ferns
      { id: 'F-001', name: 'Boston Fern', species: 'Nephrolepis exaltata', acquisitionDate: '2024-01-28', plantType: 'Fern', notes: 'Classic hanging basket fern' },
      { id: 'F-002', name: 'Maidenhair Fern', species: 'Adiantum raddianum', acquisitionDate: '2024-02-12', plantType: 'Fern', notes: 'Delicate, humidity-loving fern' },
      { id: 'F-003', name: 'Birds Nest Fern', species: 'Asplenium nidus', acquisitionDate: '2024-03-08', plantType: 'Fern', notes: 'Glossy paddle-shaped fronds' },
      { id: 'F-004', name: 'Staghorn Fern', species: 'Platycerium bifurcatum', acquisitionDate: '2024-04-15', plantType: 'Fern', notes: 'Mounted epiphytic fern' },

      // Succulents
      { id: 'S-001', name: 'Snake Plant', species: 'Sansevieria trifasciata', acquisitionDate: '2024-01-03', plantType: 'Succulent', notes: 'Extremely low maintenance' },
      { id: 'S-002', name: 'Jade Plant', species: 'Crassula ovata', acquisitionDate: '2024-02-25', plantType: 'Succulent', notes: 'Money tree, very easy to propagate' },
      { id: 'S-003', name: 'Aloe Vera', species: 'Aloe barbadensis', acquisitionDate: '2024-03-18', plantType: 'Succulent', notes: 'Medicinal plant for burns' },
      { id: 'S-004', name: 'Echeveria', species: 'Echeveria elegans', acquisitionDate: '2024-01-22', plantType: 'Succulent', notes: 'Rosette-forming succulent' },
      { id: 'S-005', name: 'String of Pearls', species: 'Senecio rowleyanus', acquisitionDate: '2024-04-10', plantType: 'Succulent', notes: 'Trailing succulent with bead-like leaves' },

      // Calatheas
      { id: 'C-001', name: 'Calathea Orbifolia', species: 'Calathea orbifolia', acquisitionDate: '2024-02-05', plantType: 'Calathea', notes: 'Large round leaves with silver stripes' },
      { id: 'C-002', name: 'Calathea Rattlesnake', species: 'Calathea lancifolia', acquisitionDate: '2024-03-01', plantType: 'Calathea', notes: 'Wavy-edged leaves with dark spots' },
      { id: 'C-003', name: 'Calathea White Fusion', species: 'Calathea White Fusion', acquisitionDate: '2024-01-16', plantType: 'Calathea', notes: 'Striking white and green variegation' },
      { id: 'C-004', name: 'Calathea Medallion', species: 'Calathea roseopicta', acquisitionDate: '2024-04-03', plantType: 'Calathea', notes: 'Round leaves with pink undersides' },

      // Ficuses
      { id: 'FI-001', name: 'Fiddle Leaf Fig', species: 'Ficus lyrata', acquisitionDate: '2024-01-10', plantType: 'Ficus', notes: 'Large violin-shaped leaves' },
      { id: 'FI-002', name: 'Rubber Plant', species: 'Ficus elastica', acquisitionDate: '2024-02-15', plantType: 'Ficus', notes: 'Glossy burgundy leaves' },
      { id: 'FI-003', name: 'Ficus Tineke', species: 'Ficus elastica Tineke', acquisitionDate: '2024-03-25', plantType: 'Ficus', notes: 'Variegated rubber plant' },

      // Hoyas
      { id: 'H-001', name: 'Hoya Carnosa', species: 'Hoya carnosa', acquisitionDate: '2024-02-20', plantType: 'Hoya', notes: 'Waxy flowers, trailing vine' },
      { id: 'H-002', name: 'Hoya Pubicalyx', species: 'Hoya pubicalyx', acquisitionDate: '2024-03-28', plantType: 'Hoya', notes: 'Silver-spotted leaves' },
      { id: 'H-003', name: 'Hoya Kerrii', species: 'Hoya kerrii', acquisitionDate: '2024-01-14', plantType: 'Hoya', notes: 'Heart-shaped leaves' },

      // Dracaenas
      { id: 'D-001', name: 'Dragon Tree', species: 'Dracaena marginata', acquisitionDate: '2024-02-03', plantType: 'Dracaena', notes: 'Spiky red-edged leaves' },
      { id: 'D-002', name: 'Corn Plant', species: 'Dracaena fragrans', acquisitionDate: '2024-03-10', plantType: 'Dracaena', notes: 'Wide green leaves with yellow stripes' },

      // ZZ Plants
      { id: 'Z-001', name: 'ZZ Plant', species: 'Zamioculcas zamiifolia', acquisitionDate: '2024-01-26', plantType: 'ZZ Plant', notes: 'Nearly indestructible houseplant' },
      { id: 'Z-002', name: 'Raven ZZ', species: 'Zamioculcas zamiifolia Raven', acquisitionDate: '2024-03-14', plantType: 'ZZ Plant', notes: 'Black-purple foliage' },

      // Begonias
      { id: 'B-001', name: 'Rex Begonia', species: 'Begonia rex', acquisitionDate: '2024-02-28', plantType: 'Begonia', notes: 'Colorful patterned leaves' },
      { id: 'B-002', name: 'Angel Wing Begonia', species: 'Begonia coccinea', acquisitionDate: '2024-04-07', plantType: 'Begonia', notes: 'Wing-shaped spotted leaves' },

      // Uncategorized/Other
      { id: 'O-001', name: 'Prayer Plant', species: 'Maranta leuconeura', acquisitionDate: '2024-01-20', plantType: 'Other', notes: 'Leaves fold up at night like praying hands' },
      { id: 'O-002', name: 'Chinese Money Plant', species: 'Pilea peperomioides', acquisitionDate: '2024-02-16', plantType: 'Other', notes: 'Round coin-shaped leaves' },
      { id: 'O-003', name: 'Swiss Cheese Vine', species: 'Monstera obliqua', acquisitionDate: '2024-03-30', plantType: 'Other', notes: 'Extremely rare, more holes than leaf!' },
      { id: 'O-004', name: 'Mystery Plant', species: 'Unknown species', acquisitionDate: '2024-04-20', plantType: undefined, notes: 'Found this at a garage sale, need to identify!' }
    ];

    try {
      localStorage.setItem('sporelia_plants', JSON.stringify(samplePlants));
      alert('✅ Loaded 50 sample plants! Refresh the page to see them.');
      
      // Log summary
      const typeCount: Record<string, number> = {};
      samplePlants.forEach(plant => {
        const type = plant.plantType || 'Uncategorized';
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      
      console.log('📊 Plant count by type:');
      Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
    } catch (error) {
      alert('❌ Error loading sample data: ' + error);
    }
  };

  const clearData = () => {
    localStorage.removeItem('sporelia_plants');
    alert('🗑️ Cleared all plant data! Refresh the page.');
  };

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: '#ffffff',
      border: '2px solid #28a745',
      borderRadius: '8px',
      padding: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontSize: '12px'
    }}>
      <div style={{ marginBottom: '5px', fontWeight: 'bold', color: '#28a745' }}>
        🚧 Dev Tools
      </div>
      <button
        onClick={loadSampleData}
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px',
          marginRight: '5px'
        }}
      >
        Load 50 Sample Plants
      </button>
      <button
        onClick={clearData}
        style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        Clear All Data
      </button>
    </div>
  );
};

export default DevSampleDataLoader;
