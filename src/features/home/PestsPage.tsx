import React from 'react';

const PestsPage: React.FC = () => {
  return (
    <div className="p-6 bg-cream-pulp rounded-card shadow-subtle border border-lichen-veil">
      <div className="flex items-center mb-6">
        <i className="fas fa-bug text-3xl text-canopy-green mr-4"></i>
        <h1 className="text-3xl font-bold text-canopy-green font-heading">
          Pest Management
        </h1>
      </div>
      <p className="text-text-muted font-body mb-6">
        This sanctuary for your plants will soon help you identify and manage common pests. Stay tuned for tips and tracking tools to keep your green friends healthy and happy!
      </p>
      <div className="mt-6 p-4 bg-lichen-veil/50 rounded-md">
        <h2 className="text-xl font-semibold text-canopy-green font-heading">Coming Soon:</h2>
        <ul className="list-disc list-inside text-text-muted font-body mt-2 space-y-1">
          <li>Interactive pest identification guide</li>
          <li>Personalized treatment tracking and reminders</li>
          <li>Database of organic and effective preventative measures</li>
          <li>Community insights on pest control</li>
        </ul>
      </div>
       <div className="mt-8 text-center">
        <i className="fas fa-cogs text-4xl text-sage-mist opacity-50"></i>
        <p className="text-sm text-text-muted mt-2">Our little garden gnomes are hard at work!</p>
      </div>
    </div>
  );
};

export default PestsPage;