import React from 'react';

const FertilizerPage: React.FC = () => {
  return (
    <div className="p-6 bg-cream-pulp rounded-card shadow-subtle border border-lichen-veil">
      <div className="flex items-center mb-6">
        <i className="fas fa-flask text-3xl text-canopy-green mr-4"></i>
        <h1 className="text-3xl font-bold text-canopy-green font-heading">
          Fertilizer Hub
        </h1>
      </div>
      <p className="text-text-muted font-body mb-6">
        Nourish your plants to perfection! This section will soon blossom with tools to manage your fertilizer inventory, create custom feeding schedules, and understand your plants' nutritional needs.
      </p>
      <div className="mt-6 p-4 bg-lichen-veil/50 rounded-md">
        <h2 className="text-xl font-semibold text-canopy-green font-heading">Coming Soon:</h2>
        <ul className="list-disc list-inside text-text-muted font-body mt-2 space-y-1">
          <li>Comprehensive fertilizer type database (NPK values, usage)</li>
          <li>Customizable feeding schedules per plant or group</li>
          <li>Inventory tracking for your fertilizers</li>
          <li>Reminders for when to feed your plants</li>
        </ul>
      </div>
      <div className="mt-8 text-center">
        <i className="fas fa-cogs text-4xl text-sage-mist opacity-50"></i>
        <p className="text-sm text-text-muted mt-2">Our little garden gnomes are hard at work!</p>
      </div>
    </div>
  );
};

export default FertilizerPage;