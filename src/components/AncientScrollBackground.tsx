import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const AncientScrollBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Top thread unrolling (moves up and loosens)
  const topThreadY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const topThreadOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Bottom scroll unrolling mapping to cover the whole page
  // The 'paper' is basically the background color stretching down
  const paperHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // The actual rolled-up cylinders at the top and bottom
  const topScrollY = useTransform(scrollYProgress, [0, 0.1], [0, -100]);
  const bottomScrollY = useTransform(scrollYProgress, [0, 1], ["0vh", "100vh"]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#1a1a1a] overflow-hidden">
      
      {/* The Scroll Container - Behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center w-full max-w-[1400px] mx-auto opacity-90">
        
        {/* The unrolling "paper" background */}
        <motion.div 
          className="absolute top-0 w-full bg-[#fdfbf7] shadow-[inset_0_0_50px_rgba(0,0,0,0.1)] rounded-sm"
          style={{ 
            height: paperHeight,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top Scroll Cylinder */}
        <motion.div 
          className="absolute w-[105%] h-12 bg-gradient-to-b from-[#d4c5a9] via-[#e2d5b8] to-[#c5b496] rounded-full shadow-2xl border border-black/10 flex items-center justify-center -top-6"
          style={{ y: topScrollY }}
        >
          {/* Thread holding the top scroll */}
          <motion.div 
            className="absolute w-2 h-16 bg-[#5A5A40] rounded-full shadow-md"
            style={{ y: topThreadY, opacity: topThreadOpacity }}
          />
        </motion.div>

        {/* Bottom Scroll Cylinder (rolls down) */}
        <motion.div 
          className="absolute w-[105%] h-12 bg-gradient-to-t from-[#c5b496] via-[#e2d5b8] to-[#d4c5a9] rounded-full shadow-xl border border-black/10 -top-6"
          style={{ y: bottomScrollY }}
        />
        
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto shadow-2xl bg-transparent min-h-screen">
        {children}
      </div>
      
    </div>
  );
};
