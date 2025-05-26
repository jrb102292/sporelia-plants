import React from 'react';

interface LoadingSpinnerProps {
  size?: string;
  color?: string; // e.g., border-canopy-green, border-sage-mist
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'w-8 h-8', 
  color = 'border-canopy-green' 
}) => {
  return (
    <div 
      className={`animate-spin rounded-full ${size} border-t-4 border-b-4 ${color} border-opacity-50`}
      role="progressbar"
      aria-label="Loading"
    ></div>
  );
};

export default LoadingSpinner;