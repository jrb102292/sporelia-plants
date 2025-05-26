import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <i className="fas fa-compass fa-5x text-lichen-veil mb-8"></i>
      <h1 className="text-4xl font-bold text-canopy-green font-heading mb-4">404 - Lost in the Foliage</h1>
      <p className="text-xl text-text-muted font-body mb-8 max-w-lg mx-auto">
        Oops! It seems the page you're looking for has wandered off the path or hasn't been cultivated yet.
      </p>
      <a
        href="#/plants"
        className="inline-block bg-canopy-green hover:bg-opacity-90 text-cream-pulp font-medium py-3 px-8 rounded-button shadow-sm hover:shadow-interactive transition-all duration-200 ease-out text-base uppercase tracking-wider focus:outline-none focus-style"
      >
        <i className="fas fa-home mr-2"></i>Back to My Garden
      </a>
    </div>
  );
};

export default NotFoundPage;