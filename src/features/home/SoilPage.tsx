import React from 'react';

const SoilPage: React.FC = () => {
  return (
    <div className="p-6 bg-cream-pulp rounded-card shadow-subtle border border-lichen-veil">
      <div className="flex items-center mb-6">
        {/* Changed icon to something more related to soil/earth */}
        <i className="fas fa-mountain text-3xl text-canopy-green mr-4"></i> 
        <h1 className="text-3xl font-bold text-canopy-green font-heading">
          Soil & Substrates
        </h1>
      </div>
      <p className="text-text-muted font-body mb-6">
        The foundation of a healthy plant! Soon, this space will help you discover ideal soil mixes, manage your substrate components, and keep track of repotting schedules.
      </p>
      <div className="mt-6 p-4 bg-lichen-veil/50 rounded-md">
        <h2 className="text-xl font-semibold text-canopy-green font-heading">Coming Soon:</h2>
        <ul className="list-disc list-inside text-text-muted font-body mt-2 space-y-1">
          <li>Curated soil mix recipes for various plant types</li>
          <li>Information on individual substrate components (e.g., perlite, coco coir)</li>
          <li>Repotting logs and reminders for your plants</li>
          <li>Tips for amending and improving soil health</li>
        </ul>
      </div>
      <div className="mt-8 text-center">
        <i className="fas fa-cogs text-4xl text-sage-mist opacity-50"></i>
        <p className="text-sm text-text-muted mt-2">Our little garden gnomes are hard at work!</p>
      </div>
    </div>
  );
};

export default SoilPage;