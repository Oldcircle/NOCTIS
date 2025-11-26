
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, animate } from 'framer-motion';

const FluidBackground: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Initialize in center to avoid corner flash
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Smooth mouse movement for the mask center
  const springConfig = { damping: 25, stiffness: 150 };
  const maskX = useSpring(mouseX, springConfig);
  const maskY = useSpring(mouseY, springConfig);

  // Mask Radius control for the expansion effect
  const maskRadius = useMotionValue(250); // Initial flashlight size

  useEffect(() => {
    // Animate mask radius: 250px (default) <-> 200% of screen (expanded)
    const maxDim = typeof window !== 'undefined' ? Math.max(window.innerWidth, window.innerHeight) : 1000;
    const targetRadius = isExpanded ? maxDim * 1.5 : 250;
    
    animate(maskRadius, targetRadius, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // Custom exponential ease out
    });
  }, [isExpanded]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleClick = (e: MouseEvent) => {
      // Don't trigger background expansion if clicking UI elements
      if ((e.target as HTMLElement).closest('button, a, input, [data-hover="true"]')) {
        return;
      }
      setIsExpanded(prev => !prev);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      
      {/* 
         LAYER 0 (BOTTOM): The "Hidden" Reality (Cyber City)
         This layer is always fully visible underneath, but covered by Layer 1.
         We see it through the "hole" in Layer 1.
      */}
      <div className="absolute inset-0 z-0">
          {/* Cyberpunk City Image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574365738686-22db1463e27a?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center" />
          
          {/* Dark Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/60" /> 
      </div>

      {/* 
         LAYER 1 (TOP): The "System" (Black Grid)
         We use a Mask to punch a hole in this layer.
         Logic: 
           - Transparent in Mask = Invisible Layer 1 (Shows Layer 0/City).
           - Black in Mask = Visible Layer 1 (Shows System).
      */}
      <motion.div 
        className="absolute inset-0 z-10 bg-[#050505]"
        style={{
          // Use radial gradient: 
          // Center (mouse) is transparent (The Hole).
          // Outer edge is black (The Cover).
          WebkitMaskImage: useMotionTemplate`radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, transparent 40%, black 100%)`,
          maskImage: useMotionTemplate`radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, transparent 40%, black 100%)`
        }}
      >
        {/* System Layer Content */}
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

        {/* Digital Fog / Glows */}
        <motion.div
          className="absolute top-[-20%] left-[10%] w-[60vw] h-[60vw] bg-[#0055ff] rounded-full mix-blend-screen filter blur-[120px] opacity-10"
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#00f0ff] rounded-full mix-blend-screen filter blur-[120px] opacity-10"
          animate={{
            x: [0, -50, 25, 0],
            y: [0, 20, -20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      </motion.div>

    </div>
  );
};

export default FluidBackground;
