// Constants used throughout the application
export const DEFAULT_PLANT_IMAGE = 'https://source.unsplash.com/featured/?plant,houseplant';

// Animation variants for Framer Motion
export const FADE_IN_ANIMATION = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const STAGGER_CHILDREN = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const SCALE_IN_ANIMATION = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

// 3D Plant model configurations
export const PLANT_MODELS = {
  monstera: '/models/monstera.glb',
  snake: '/models/snake_plant.glb',
  succulent: '/models/succulent.glb',
  fern: '/models/fern.glb',
  default: '/models/generic_plant.glb'
};

// Common page transition settings
export const PAGE_TRANSITION = {
  type: 'spring',
  stiffness: 100,
  damping: 20
};
