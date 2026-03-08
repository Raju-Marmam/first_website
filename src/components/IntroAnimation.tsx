import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1000); // Show gate
    const timer2 = setTimeout(() => setStep(2), 3000); // Open gate
    const timer3 = setTimeout(() => setStep(3), 5000); // Show logo
    const timer4 = setTimeout(() => onComplete(), 8000); // Complete

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f2ed] overflow-hidden">
      {/* Background Ambience - Birds/Nature sounds would be here in a real app */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 animate-pulse">🍃</div>
        <div className="absolute bottom-20 right-20 animate-bounce">🐦</div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="gate-closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center"
          >
            <div className="w-64 h-80 border-8 border-[#5A5A40] rounded-t-full relative overflow-hidden bg-[#e5e0d8]">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full border-r-4 border-[#5A5A40] bg-[#dcd7cc]" />
                <div className="w-1/2 h-full bg-[#dcd7cc]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-[#5A5A40]" />
              </div>
            </div>
            <p className="mt-8 font-serif italic text-[#5A5A40] text-xl">Arriving at the Haven...</p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="gate-opening"
            className="relative flex flex-col items-center w-full h-full justify-center"
          >
            <div className="relative w-64 h-80 perspective-1000">
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -110 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute left-0 top-0 w-1/2 h-full border-8 border-[#5A5A40] border-r-0 rounded-tl-full bg-[#dcd7cc] origin-left z-10"
              />
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 110 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute right-0 top-0 w-1/2 h-full border-8 border-[#5A5A40] border-l-0 rounded-tr-full bg-[#dcd7cc] origin-right z-10"
              />
              
              {/* View through the gate */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 3, delay: 0.5 }}
                className="absolute inset-0 flex items-center justify-center -z-10"
              >
                <div className="w-full h-full bg-gradient-to-b from-emerald-100 to-emerald-300 rounded-t-full blur-sm" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="logo-reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center text-center px-6"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="mb-6"
            >
              <div className="w-24 h-24 bg-[#5A5A40] rounded-full flex items-center justify-center text-white text-4xl mb-4">
                🌿
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a1a] mb-4 tracking-tight">
              Shashi Kumar Resort
            </h1>
            <p className="text-xl md:text-2xl font-serif italic text-[#5A5A40] tracking-wide">
              Village Celebration Resort
            </p>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              className="h-px bg-[#5A5A40] mt-8"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={onComplete}
        className="absolute bottom-10 right-10 text-sm font-medium text-[#5A5A40] underline underline-offset-4 hover:text-[#1a1a1a] transition-colors"
      >
        Skip Intro
      </button>
    </div>
  );
};
