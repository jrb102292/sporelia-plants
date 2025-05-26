'use client';

import { useRef, useState, useEffect, Suspense, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, useAnimations } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { PLANT_MODELS } from '@/constants';
import { Plant } from '@/types';
import { gsap } from 'gsap';

// Model component with advanced animations
function PlantModel({ plantType, isWatering }: { plantType?: string; isWatering: boolean }) {
  const modelRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Object3D[]>([]);
  const modelPath = plantType && PLANT_MODELS[plantType.toLowerCase() as keyof typeof PLANT_MODELS] 
    ? PLANT_MODELS[plantType.toLowerCase() as keyof typeof PLANT_MODELS]
    : PLANT_MODELS.default;
  
  // Fallback to default model if the specific one fails to load
  const { scene } = useGLTF(modelPath, true, (error) => {
    console.error('Error loading plant model:', error);
    // The useGLTF will automatically try to load the default if the specific one fails
  });

  // Collect all leaves/meshes for individual animation
  useEffect(() => {
    if (modelRef.current) {
      leavesRef.current = [];
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          leavesRef.current.push(child);
        }
      });
    }
  }, []);

  // Animate watering effect
  useEffect(() => {
    if (isWatering && leavesRef.current.length > 0) {
      leavesRef.current.forEach((leaf, index) => {
        gsap.to(leaf.scale, {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 0.5,
          delay: index * 0.05,
          ease: "elastic.out(1, 0.3)",
          yoyo: true,
          repeat: 1
        });
        
        // Randomize color brightness to simulate "freshening" of the plant
        const originalColor = leaf.material instanceof THREE.Material && leaf.material.color ? 
                             leaf.material.color.clone() : 
                             new THREE.Color(0x00ff00);
                             
        if (leaf.material instanceof THREE.Material && leaf.material.color) {
          gsap.to(leaf.material.color, {
            r: originalColor.r * 1.2,
            g: originalColor.g * 1.2,
            b: originalColor.b * 1.2,
            duration: 0.5,
            delay: index * 0.05,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              if (leaf.material instanceof THREE.Material && leaf.material.color) {
                leaf.material.color.set(originalColor);
              }
            }
          });
        }
      });
    }
  }, [isWatering]);
  
  // Create more sophisticated animated movements
  useFrame(({ clock }) => {
    if (!modelRef.current) return;
    
    const elapsedTime = clock.getElapsedTime();
    
    // Main plant gentle swaying motion
    modelRef.current.rotation.y = Math.sin(elapsedTime * 0.2) * 0.05;
    
    // Subtle breathing effect for the whole plant
    const breathe = Math.sin(elapsedTime * 0.5) * 0.01 + 1;
    modelRef.current.scale.set(breathe, breathe, breathe);
    
    // Animate individual leaves/branches with different frequencies
    leavesRef.current.forEach((leaf, index) => {
      const frequency = 0.2 + (index % 5) * 0.05;
      const amplitude = 0.005 + (index % 3) * 0.002;
      const phase = index * 0.2;
      
      // Apply small rotations to simulate wind
      if (leaf.rotation) {
        leaf.rotation.x = Math.sin(elapsedTime * frequency + phase) * amplitude;
        leaf.rotation.z = Math.cos(elapsedTime * frequency * 0.7 + phase) * amplitude;
      }
    });
  });

  return (
    <primitive 
      object={scene.clone()} 
      ref={modelRef}
      scale={1.5}
      position={[0, -1, 0]}
    />
  );
}

interface Plant3DVisualizerProps {
  plant: Plant;
}

export type Plant3DVisualizerRef = {
  triggerWateringAnimation: () => void;
};

const Plant3DVisualizer = forwardRef<Plant3DVisualizerRef, Plant3DVisualizerProps>(({ plant }, ref) => {
  const [isRotating, setIsRotating] = useState(true);
  const [isWatering, setIsWatering] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  
  // Function to trigger watering animation
  const triggerWateringAnimation = () => {
    setIsWatering(true);
    setShowSparkles(true);
    
    // Reset after animation completes
    setTimeout(() => {
      setIsWatering(false);
      setTimeout(() => setShowSparkles(false), 1500);
    }, 1500);
  };
  
  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    triggerWateringAnimation
  }));
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-card overflow-hidden bg-gradient-to-b from-lichen-veil/30 to-transparent relative"
    >
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Suspense fallback={null}>
          <PlantModel plantType={plant.plantType} isWatering={isWatering} />
          <Environment preset="sunset" />
          <ContactShadows opacity={0.4} scale={5} blur={2.4} />
        </Suspense>
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate={isRotating}
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
      
      {/* Sparkle animation overlay for watering effect */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              initial={{
                opacity: 0,
                x: `${Math.random() * 100}%`, 
                y: '0%',
                scale: 1
              }}
              animate={{
                opacity: [0, 1, 0],
                y: `${50 + Math.random() * 50}%`,
                scale: [1, 1.5, 0],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white/90 transition-colors"
          title={isRotating ? "Pause rotation" : "Resume rotation"}
        >
          {isRotating ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-canopy-green" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-canopy-green" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <button
          onClick={() => {
            // Reset camera
            const canvas = document.querySelector('canvas');
            if (canvas) {
              const event = new MouseEvent('dblclick', {
                view: window,
                bubbles: true,
                cancelable: true
              });
              canvas.dispatchEvent(event);
            }
          }}
          className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white/90 transition-colors"
          title="Reset view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-canopy-green" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={triggerWateringAnimation}
          disabled={isWatering}
          className={`bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white/90 transition-colors ${isWatering ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Simulate watering"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Instruction overlay */}
      <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm text-canopy-green shadow-sm">
        <p>Drag to rotate • Scroll to zoom • Use controls to interact</p>
      </div>
    </motion.div>
  );
}
