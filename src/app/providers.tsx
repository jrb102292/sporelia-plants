'use client';

import { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1] // Custom easing for organic feel
      }}
    >
      {children}
    </MotionConfig>
  );
}
