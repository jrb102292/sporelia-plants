import React, { useState } from 'react';

const ProjectRoadmap: React.FC = () => {
  const [completedItems, setCompletedItems] = useState<string[]>([
    'basic-navigation',
    'plant-storage',
    'plant-display',
    'plant-filtering'
  ]);

  const toggleItem = (id: string) => {
    setCompletedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const roadmapData = {
    "Core Features - Phase 1": [
      { id: 'basic-navigation', text: 'Navigation between pages (Home, Plants, Dashboard)', status: 'completed' },
      { id: 'plant-storage', text: 'Plant data storage in localStorage', status: 'completed' },
      { id: 'plant-display', text: 'Plant collection display (showcase & card views)', status: 'completed' },
      { id: 'plant-filtering', text: 'Plant filtering by type/category', status: 'completed' },
      { id: 'plant-crud', text: 'Complete CRUD operations for plants', status: 'in-progress' },
      { id: 'plant-images', text: 'Plant image upload and display', status: 'pending' },
      { id: 'cutting-system', text: 'Cutting creation and lineage tracking', status: 'pending' },
    ],
    
    "UI/UX Improvements - Phase 2": [
      { id: 'responsive-design', text: 'Mobile-responsive layout improvements', status: 'pending' },
      { id: 'monstera-icon', text: 'Replace seedling icon with monstera leaf design', status: 'pending' },
      { id: 'delicate-design', text: 'Make overall design more delicate/refined', status: 'pending' },
      { id: 'home-hero-images', text: 'Add beautiful plant imagery to home page hero', status: 'pending' },
      { id: 'loading-states', text: 'Proper loading states and transitions', status: 'pending' },
    ],

    "Plant Care Features - Phase 3": [
      { id: 'care-schedules', text: 'Watering and care schedule tracking', status: 'pending' },
      { id: 'care-reminders', text: 'Care reminder notifications', status: 'pending' },
      { id: 'plant-health', text: 'Plant health monitoring and logging', status: 'pending' },
      { id: 'progress-photos', text: 'Plant progress photo timeline', status: 'pending' },
    ],

    "AI Integration - Phase 4": [
      { id: 'gemini-setup', text: 'Gemini AI service integration', status: 'pending' },
      { id: 'plant-identification', text: 'AI plant identification from photos', status: 'pending' },
      { id: 'care-recommendations', text: 'AI-powered care recommendations', status: 'pending' },
      { id: 'problem-diagnosis', text: 'AI plant problem diagnosis', status: 'pending' },
    ],

    "Advanced Features - Phase 5": [
      { id: 'plant-journal', text: 'Personal plant care journal/notes', status: 'pending' },
      { id: 'growth-analytics', text: 'Plant growth analytics and insights', status: 'pending' },
      { id: 'plant-sharing', text: 'Share plant collections (export/import)', status: 'pending' },
      { id: 'offline-support', text: 'Offline functionality and sync', status: 'pending' },
    ]
  };
  const currentFocus = [
    "✅ FIXED: Modal rendering for plant forms",
    "🎯 CURRENT: Test plant creation workflow end-to-end",
    "📝 NEXT: Complete plant editing functionality", 
    "🗑️ THEN: Ensure plant deletion works properly"
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Sporelia Development Roadmap</h1>
          {/* Current Focus */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">🎯 Current Focus</h2>
          <ul className="space-y-2">
            {currentFocus.map((item, index) => (
              <li key={index} className="text-blue-800">{item}</li>
            ))}
          </ul>
        </div>

        {/* Recent Fixes */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-3">✅ Recent Fixes</h2>
          <ul className="space-y-1 text-green-800 text-sm">
            <li>• Fixed ModalHost to properly wrap PlantFormDrawer in Dialog.Root</li>
            <li>• Fixed plant creation modal payload to include proper mode parameter</li>
            <li>• Added data-testid attributes to form elements</li>
            <li>• Corrected modal opening logic in PlantCollectionPage</li>
          </ul>
        </div>

        {/* Development Philosophy */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold text-amber-900 mb-3">📋 Development Philosophy</h2>
          <ul className="space-y-1 text-amber-800">
            <li>• Build features first, optimize later</li>
            <li>• Focus on user experience over perfect code</li>
            <li>• Test major workflows, not every edge case</li>
            <li>• If stuck on same problem 4+ times, realign with roadmap</li>
          </ul>
        </div>

        {/* Roadmap Phases */}
        {Object.entries(roadmapData).map(([phase, items]) => (
          <div key={phase} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{phase}</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={completedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="h-4 w-4 text-green-600 rounded"
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className={`${completedItems.includes(item.id) ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notes Section */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">📝 Development Notes</h2>
          <ul className="space-y-1 text-gray-700 text-sm">
            <li>• Navigation working well - users can browse plant types</li>
            <li>• Plant display looks good in both showcase and card views</li>
            <li>• Need to complete plant editing/deletion functionality</li>
            <li>• Image upload is critical for user engagement</li>
            <li>• Cutting system will differentiate us from other plant apps</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectRoadmap;
