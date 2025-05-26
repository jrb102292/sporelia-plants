'use client';

import { useState } from 'react';

interface DeleteButtonProps {
  onDelete: () => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text';
  className?: string;
}

export function DeleteButton({ onDelete, size = 'md', variant = 'icon', className = '' }: DeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      // Reset confirmation after 3 seconds
      setTimeout(() => setIsConfirming(false), 3000);
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete();
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const variantClasses = {
    icon: `rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 
           transition-colors duration-200 flex items-center justify-center
           ${isConfirming ? 'bg-red-100 text-red-700' : ''}`,
    text: `px-4 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 
           transition-colors duration-200 flex items-center justify-center gap-2
           ${isConfirming ? 'bg-red-100 text-red-700' : ''}`
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
        ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={isConfirming ? 'Click again to confirm' : 'Delete'}
    >
      {isDeleting ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : isConfirming ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
      {variant === 'text' && (
        <span>{isConfirming ? 'Confirm Delete' : 'Delete'}</span>
      )}
    </button>
  );
} 