import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface BirthdayCakeProps {
  onComplete: () => void;
  triggerConfetti: (x: number, y: number, count?: number) => void;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ onComplete, triggerConfetti }) => {
  // Let's have candles. A 19th birthday can have candles on top!
  // We can represent candles with standard indices. Tapping each blows it out.
  // Or click standard "Blow Out" button.
  const [candles, setCandles] = useState([
    { id: 1, x: -50, isLit: true },
    { id: 2, x: -25, isLit: true },
    { id: 3, x: 0, isLit: true },
    { id: 4, x: 25, isLit: true },
    { id: 5, x: 50, isLit: true },
  ]);

  const [hasBlown, setHasBlown] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);

  const handleCandleClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCandles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLit: false } : c))
    );
    triggerConfetti(e.clientX, e.clientY, 12);

    // If all lights are out, trigger big victory
    const anyLeftLit = candles.some((c) => c.id !== id && c.isLit);
    if (!anyLeftLit) {
      triggerAllBlownOut();
    }
  };

  const triggerAllBlownOut = () => {
    setHasBlown(true);
    // Trigger enormous confetti burst across screen
    const width = window.innerWidth;
    const height = window.innerHeight;
    triggerConfetti(width / 2, height * 0.4, 60);
    setTimeout(() => triggerConfetti(width / 3, height * 0.5, 40), 300);
    setTimeout(() => triggerConfetti((width * 2) / 3, height * 0.5, 40), 600);
  };

  const handleBlowButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBlowing(true);

    // Fade candle flames one-by-one
    candles.forEach((candle, idx) => {
      setTimeout(() => {
        setCandles((prev) =>
          prev.map((c) => (c.id === candle.id ? { ...c, isLit: false } : c))
        );
        // Make individual mini bursts near the candle
        const rect = document.getElementById(`candle-${candle.id}`)?.getBoundingClientRect();
        if (rect) {
          triggerConfetti(rect.left + rect.width / 2, rect.top, 10);
        }
      }, idx * 250);
    });

    setTimeout(() => {
      setIsBlowing(false);
      triggerAllBlownOut();
    }, candles.length * 250 + 200);
  };

  const isAllBlown = candles.every((c) => !c.isLit);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 pb-6 bg-purple-950/20 text-white rounded-3xl" id="birthday-cake-container">

      {/* Main Interactive Stage */}
      <div className="flex-1 my-4 flex flex-col justify-center items-center overflow-hidden rounded-2xl border-2 border-[#fbbf24]/30 shadow-[0_4px_20px_rgba(109,40,217,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black backdrop-blur-md relative p-4">
        {/* Sparkle background ambient lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.12)_0%,transparent_70%)] pointer-events-none" />

        <AnimatePresence mode="wait">
          {!isAllBlown ? (
            <motion.div
              key="inst-lit"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center mb-6 z-15"
            >
              <h2 className="text-3xl font-black text-white tracking-widest uppercase font-sans leading-none bold-header-main">
                BLOW IT OUT
              </h2>
              <p className="text-xs sm:text-sm text-[#fbbf24] mt-1.5 font-mono uppercase tracking-widest font-extrabold animate-pulse">
                TAP INDIVIDUAL CANDLES OR CLICK BLOW
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="inst-blown"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6 z-15 bg-black/60 p-2.5 px-5 rounded-full border border-[#fbbf24]/40 shadow-md backdrop-blur-md"
            >
              <h2 className="text-lg font-black text-[#fbbf24] tracking-wide font-sans flex items-center justify-center gap-1.5 animate-pulse uppercase">
                ✨ ALL BLOWN OUT! ✨
              </h2>
              <p className="text-xs text-[#a78bfa] font-mono uppercase font-black tracking-widest mt-1">
                DEEVENA HAS BRIGHT FAITH FOR 19
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 19 Number Neon sign */}
        <div className="relative mb-6 text-center select-none z-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{
              scale: [1, 1.03, 1],
              textShadow: !isAllBlown
                ? [
                    '0 0 10px rgba(251,191,36,0.8), 0 0 20px rgba(251,191,36,0.4)',
                    '0 0 15px rgba(251,191,36,0.95), 0 0 30px rgba(251,191,36,0.6)',
                    '0 0 10px rgba(251,191,36,0.8), 0 0 20px rgba(251,191,36,0.4)'
                  ]
                : '0 0 4px rgba(251,191,36,0.2)',
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`font-sans font-black text-6xl tracking-tight transition-all duration-1000 ${
              !isAllBlown ? 'text-[#fbbf24]' : 'text-stone-700'
            }`}
          >
            19
          </motion.div>
          <div className={`text-xs sm:text-sm uppercase tracking-widest font-mono font-black mt-1 transition-all ${
            !isAllBlown ? 'text-[#a78bfa]' : 'text-stone-700/60'
          }`}>
            years of grace
          </div>
        </div>

        {/* The Cake CSS Illustration */}
        <div className="relative flex flex-col items-center justify-end w-full h-[185px] z-10 mb-4 select-none">
          {/* Candle Rack Container */}
          <div className="absolute bottom-[108px] w-[140px] flex justify-between px-2 items-end h-[60px] z-20">
            {candles.map((candle) => (
              <div
                key={candle.id}
                id={`candle-${candle.id}`}
                onClick={(e) => handleCandleClick(candle.id, e)}
                className="relative flex flex-col items-center cursor-pointer group select-none"
                style={{ height: '55px' }}
              >
                {/* Candle Flame (conditional rendering with nice fade) */}
                <AnimatePresence>
                  {candle.isLit && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [1, 1.1, 0.95, 1.05, 1],
                        opacity: 1,
                        y: [0, -1, 0.5, -0.5, 0],
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        scale: { duration: 0.2 },
                        y: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' },
                      }}
                      className="absolute top-[-10px] w-3 h-5 bg-gradient-to-t from-amber-400 via-orange-400 to-transparent rounded-full flex justify-center items-end"
                      style={{
                        boxShadow: '0 -2px 10px rgba(251,191,36,0.8), 0 -5px 20px rgba(249,115,22,0.4)',
                        transformOrigin: 'bottom center',
                      }}
                    >
                      <div className="w-1 h-3 bg-white/70 rounded-full mb-0.5 filter blur-[0.5px]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Candle Wick */}
                <div className="w-[1.5px] h-2 bg-neutral-700 relative top-[6px]" />

                {/* Candle Pillar body */}
                <div className={`w-2.5 h-10 rounded-t-sm bg-gradient-to-b from-[#a78bfa] via-[#6d28d9] to-[#2d1b4d] shadow-md group-hover:ring-1 group-hover:ring-[#fbbf24] border border-[#a78bfa]/20 transition-all ${
                  !candle.isLit ? 'brightness-50' : 'brightness-100'
                }`} />
              </div>
            ))}
          </div>

          {/* Slices / Layers of the Birthday Cake */}
          {/* Top Layer */}
          <div className="w-[160px] h-[50px] bg-gradient-to-r from-[#6d28d9] to-[#fbbf24] rounded-2xl shadow-lg border border-purple-400/20 flex flex-col justify-between p-1 z-10 relative">
            {/* Dripping frosting effect styling */}
            <div className="flex justify-around absolute top-2 left-0 right-0 h-4 px-0.5 z-10 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-3.5 bg-purple-100 rounded-b-full shadow-inner"
                  style={{ height: `${Math.random() * 8 + 6}px` }}
                />
              ))}
            </div>
            {/* Side sprinkles */}
            <div className="h-full flex items-center justify-around z-0 px-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-2 rounded-full transform rotate-45"
                  style={{
                    backgroundColor: ['#FFE4E6', '#FDE047', '#38BDF8', '#86EFAC'][i % 4],
                    marginTop: `${(i % 3) * 4}px`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Middle/Bottom Layer */}
          <div className="w-[200px] h-[65px] bg-gradient-to-r from-purple-950 via-[#6d28d9] to-[#fbbf24] rounded-2xl shadow-xl border-t border-purple-400/10 flex items-center justify-between p-1 relative mt-[-10px] z-0">
            {/* Dripping frosting effect */}
            <div className="flex justify-around absolute top-2 left-0 right-0 h-4 px-1 z-10 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 bg-purple-200 rounded-b-full shadow-inner"
                  style={{ height: `${Math.random() * 10 + 6}px` }}
                />
              ))}
            </div>
            <div className="h-full w-full flex items-center justify-around px-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: ['#FCD34D', '#EC4899', '#A855F7', '#60A5FA'][i % 4],
                    marginTop: `${(i % 2) * 5}px`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Standard Plate/Stand base */}
          <div className="w-[240px] h-[10px] bg-gradient-to-r from-gray-200 to-gray-400 rounded-full opacity-90 shadow-2xl mt-[-2px] z-0 border border-white/25" />
        </div>

        {/* Blowing Animation overlay */}
        <AnimatePresence>
          {isBlowing && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 200, opacity: [0, 0.4, 0.1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-35"
            >
              <div className="h-[2px] w-[180px] bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-12 float-left scale-y-12 shadow-[0_0_15px_white]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blow candles button helper option */}
        <div className="flex gap-2.5 mt-2 z-15 w-full max-w-[240px]">
          <button
            id="blow-candles-automatic-btn"
            onClick={handleBlowButton}
            disabled={isAllBlown || isBlowing}
            className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider shadow-md transition-all ${
              isAllBlown
                ? 'bg-purple-950/20 text-stone-600 cursor-not-allowed border-purple-900/10'
                : 'bg-[#6d28d9] hover:bg-[#a78bfa] border border-[#fbbf24]/30 text-white active:scale-95 cursor-pointer shadow-md'
            }`}
          >
            {isBlowing ? 'BLOWING... 🌬️' : '🌬️ WIND MACHINE!'}
          </button>
        </div>
      </div>

      {/* Navigation bottom row */}
      <div className="flex items-center justify-end gap-3 mt-1 relative z-20">
        <button
          id="finish-cake-btn"
          onClick={(e) => {
            e.stopPropagation();
            const width = window.innerWidth;
            const height = window.innerHeight;
            triggerConfetti(width / 2, height / 2, 25);
            onComplete();
          }}
          disabled={!isAllBlown}
          className={`w-full p-3 text-xs tracking-widest font-black transition-all rounded-full cursor-pointer h-[48px] ${
            isAllBlown
              ? 'bold-accent-button'
              : 'bg-purple-950/20 text-stone-600 border border-purple-900/10 cursor-not-allowed text-center'
          }`}
        >
          {isAllBlown ? (
            'START CLEANING GAME 🧹'
          ) : (
            'PINCH CANDLES OUT TO PROCEED'
          )}
        </button>
      </div>
    </div>
  );
};
