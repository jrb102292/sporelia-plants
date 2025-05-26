'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FirebasePlantRepository from '@/lib/FirebasePlantRepository';
import { FADE_IN_ANIMATION, STAGGER_CHILDREN } from '@/constants';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plantCounts, setPlantCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        // Get all plants
        const plants = await FirebasePlantRepository.getAll();
        
        // Extract plant types and sort them
        const types = Array.from(
          new Set(plants.map(p => p.plantType || 'Uncategorized'))
        ).sort();
        
        // Calculate plant counts per category
        const counts: Record<string, number> = {};
        types.forEach(type => {
          counts[type] = plants.filter(p => (p.plantType || 'Uncategorized') === type).length;
        });
        
        setCategories(types);
        setPlantCounts(counts);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load plant categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Color palette for category cards
  const categoryColors = [
    'from-green-100 to-green-200 border-green-300 text-green-800',
    'from-blue-100 to-blue-200 border-blue-300 text-blue-800',
    'from-amber-100 to-amber-200 border-amber-300 text-amber-800',
    'from-rose-100 to-rose-200 border-rose-300 text-rose-800',
    'from-purple-100 to-purple-200 border-purple-300 text-purple-800',
    'from-teal-100 to-teal-200 border-teal-300 text-teal-800',
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 sm:p-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CHILDREN}
          className="max-w-7xl mx-auto"
        >
          <motion.div 
            className="mb-12 text-center"
            variants={FADE_IN_ANIMATION}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-canopy-green font-[var(--font-playfair)]">
              Plant Categories
            </h1>
            <p className="text-text-muted mt-3 max-w-2xl mx-auto">
              Browse your plants by type to easily find and manage your collection
            </p>
          </motion.div>

          {/* Loading state */}
          {isLoading && (
            <motion.div 
              className="flex justify-center py-12"
              variants={FADE_IN_ANIMATION}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-canopy-green"></div>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <motion.div 
              className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 max-w-2xl mx-auto"
              variants={FADE_IN_ANIMATION}
            >
              {error}
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && !error && categories.length === 0 && (
            <motion.div 
              className="bg-lichen-veil/20 rounded-card p-8 text-center max-w-2xl mx-auto"
              variants={FADE_IN_ANIMATION}
            >
              <p className="text-xl text-text-muted mb-4">
                No plant categories found
              </p>
              <Link 
                href="/plants/new"
                className="inline-block bg-canopy-green text-white py-2 px-4 rounded-button"
              >
                Add Your First Plant
              </Link>
            </motion.div>
          )}

          {/* Categories grid */}
          {!isLoading && !error && categories.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={STAGGER_CHILDREN}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  variants={FADE_IN_ANIMATION}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-br ${categoryColors[index % categoryColors.length]} rounded-xl p-6 border shadow-sm`}
                >
                  <Link 
                    href={`/plants?category=${encodeURIComponent(category)}`}
                    className="block h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold">{category}</h2>
                      <span className="bg-white/70 backdrop-blur-sm text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {plantCounts[category]} {plantCounts[category] === 1 ? 'plant' : 'plants'}
                      </span>
                    </div>
                    
                    {/* Plant emoji that gently sways */}
                    <motion.div 
                      className="text-5xl my-6 flex justify-center"
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{ 
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    >
                      {getCategoryEmoji(category)}
                    </motion.div>

                    <div className="mt-4 text-right">
                      <span className="inline-flex items-center text-sm font-medium">
                        View Plants
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

// Helper function to get appropriate emoji for each category
function getCategoryEmoji(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('monstera') || lowerCategory.includes('philodendron')) return '🌿';
  if (lowerCategory.includes('succulent') || lowerCategory.includes('cactus')) return '🌵';
  if (lowerCategory.includes('orchid')) return '🌸';
  if (lowerCategory.includes('fern')) return '🌱';
  if (lowerCategory.includes('palm')) return '🌴';
  if (lowerCategory.includes('bonsai')) return '🪴';
  if (lowerCategory.includes('flower') || lowerCategory.includes('rose')) return '🌹';
  if (lowerCategory.includes('tree')) return '🌳';
  if (lowerCategory.includes('herb')) return '🌿';
  if (lowerCategory.includes('vine') || lowerCategory.includes('ivy')) return '🪴';
  if (lowerCategory === 'uncategorized') return '🌱';
  
  // Default emojis to cycle through for other categories
  const defaultEmojis = ['🪴', '🌿', '🌱', '🌵', '🌲', '🌳', '🍀'];
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return defaultEmojis[hash % defaultEmojis.length];
}
