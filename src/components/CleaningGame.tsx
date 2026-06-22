import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Library, Archive, Sparkles, CheckCircle2 } from 'lucide-react';
import { CleaningItem } from '../types';

interface CleaningGameProps {
  onComplete: () => void;
  triggerConfetti: (x: number, y: number, count?: number) => void;
}

const INITIAL_MESSY_ITEMS: CleaningItem[] = [
  {
    id: 'bible-scrolls',
    name: 'Scattered Sermons & Bible',
    icon: '📖',
    description: 'Arrange sermon notes on the shelf.',
    x: 15,
    y: 20,
    isCleaned: false,
    targetBin: 'shelf',
    color: 'from-amber-400 to-yellow-600',
  },
  {
    id: 'dirty-socks',
    name: 'Crumpled Dirty Socks',
    icon: '🧦',
    description: 'Toss these in the laundry basket.',
    x: 75,
    y: 40,
    isCleaned: false,
    targetBin: 'laundry',
    color: 'from-blue-400 to-indigo-600',
  },
  {
    id: 'scrap-papers',
    name: 'Chocolate Wrappers & Junk',
    icon: '🍬',
    description: 'Junk papers go straight to dustbin.',
    x: 45,
    y: 50,
    isCleaned: false,
    targetBin: 'dustbin',
    color: 'from-zinc-400 to-zinc-600',
  },
  {
    id: 'coffee-mug',
    name: 'Dusty Coffee Mug',
    icon: '☕',
    description: 'Place this on the organizer shelf.',
    x: 20,
    y: 55,
    isCleaned: false,
    targetBin: 'shelf',
    color: 'from-rose-400 to-pink-600',
  },
  {
    id: 'crumpled-paper',
    name: 'Crumpled Error Blueprints',
    icon: '📝',
    description: 'Throw trash in the dustbin.',
    x: 60,
    y: 20,
    isCleaned: false,
    targetBin: 'dustbin',
    color: 'from-zinc-400 to-zinc-600',
  },
  {
    id: 'cluttered-clothes',
    name: 'Messy Clothes',
    icon: '👕',
    description: 'Put old garments in laundry.',
    x: 80,
    y: 70,
    isCleaned: false,
    targetBin: 'laundry',
    color: 'from-emerald-400 to-teal-600',
  },
];

export const CleaningGame: React.FC<CleaningGameProps> = ({ onComplete, triggerConfetti }) => {
  const [items, setItems] = useState<CleaningItem[]>(INITIAL_MESSY_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedItem = items.find((i) => i.id === selectedItemId);

  const handleSelectItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === id);
    if (!item || item.isCleaned) return;

    setSelectedItemId(id);
    setErrorMsg(null);
    setSuccessMsg(null);
    triggerConfetti(e.clientX, e.clientY, 10);
  };

  const handleBinClick = (binType: 'dustbin' | 'laundry' | 'shelf', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItemId) {
      setErrorMsg('👉 FIRST CLICK A MESSY ITEM ABOVE, DEEVENA!');
      return;
    }

    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;

    if (item.targetBin === binType) {
      // Clean success!
      setItems((prev) =>
        prev.map((i) => (i.id === selectedItemId ? { ...i, isCleaned: true } : i))
      );
      setSelectedItemId(null);
      setErrorMsg(null);
      setSuccessMsg(`✨ Excellent! Sorted "${item.name}" correctly!`);

      // Celebrate at coordinates
      triggerConfetti(e.clientX, e.clientY, 25);

      // Check if completely finished
      const remaining = items.filter((i) => i.id !== selectedItemId && !i.isCleaned);
      if (remaining.length === 0) {
        setTimeout(() => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          triggerConfetti(width / 2, height / 2, 50);
        }, 500);
      }
    } else {
      // Fail
      setErrorMsg(`❌ Oops! "${item.name}" doesn't go there! Try another bin.`);
      setSuccessMsg(null);
    }
  };

  const activeCleansCount = items.filter((i) => i.isCleaned).length;
  const isFinished = activeCleansCount === items.length;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 pb-6 bg-purple-950/20 text-white rounded-3xl" id="cleaning-game-canvas">

      {/* Main Room Canvas with clutter */}
      <div className="flex-1 my-3.5 relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#fbbf24]/30 shadow-[0_4px_20px_rgba(109,40,217,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black backdrop-blur-md p-3">
        {/* Floating background grids representing messy desk room */}
        <div className="absolute inset-0 border border-purple-500/10 bg-[linear-gradient(rgba(147,51,234,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Dynamic Instructional Title Panel */}
        <div className="w-full text-center relative z-10 min-h-[44px]">
          <AnimatePresence mode="wait">
            {errorMsg ? (
              <motion.p
                key="msg-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-xs sm:text-sm font-mono text-rose-300 font-black tracking-wide uppercase"
              >
                {errorMsg}
              </motion.p>
            ) : successMsg ? (
              <motion.p
                key="msg-success"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-xs sm:text-sm font-mono text-emerald-300 font-extrabold tracking-wide uppercase"
              >
                {successMsg}
              </motion.p>
            ) : selectedItem ? (
              <motion.p
                key="msg-sel"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-xs sm:text-sm font-mono text-purple-200 tracking-wide"
              >
                Selected: <span className="text-[#fbbf24] font-extrabold">{selectedItem.name} {selectedItem.icon}</span>. TAP SORTING SLOT BELOW!
              </motion.p>
            ) : (
              <motion.p
                key="msg-def"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs sm:text-sm font-sans text-purple-150 font-bold leading-snug"
              >
                Click any messy item to pick it, then tap its proper sorting slot below!
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Bedroom Area with Messy Items */}
        <div className="flex-1 w-full bg-black/40 rounded-xl relative border border-[#fbbf24]/10 overflow-hidden min-h-[160px] my-2 p-1">
          {/* Desk Sketch or spiritual quote vector illustration in center */}
          <div className="absolute inset-0 flex flex-col justify-center items-center opacity-10 select-none pointer-events-none">
            <span className="text-8xl">💒</span>
            <span className="text-[10px] font-mono mt-1 font-bold">100% FAITH & PURITY</span>
          </div>

          {/* Clutter items map */}
          {items.map((item) => (
            <AnimatePresence key={item.id}>
              {!item.isCleaned && (
                <motion.button
                  id={`clutter-item-${item.id}`}
                  onClick={(e) => handleSelectItem(item.id, e)}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{
                    scale: selectedItemId === item.id ? 1.15 : 1,
                    opacity: 1,
                    boxShadow: selectedItemId === item.id 
                      ? '0 0 14px rgb(251,191,36), 0 0 4px rgb(251,191,36)'
                      : '0 4px 6px rgba(0,0,0,0.3)',
                    borderColor: selectedItemId === item.id ? '#fbbf24' : 'rgba(251,191,36,0.1)',
                  }}
                  exit={{ scale: 0, opacity: 0, y: 50, rotate: 180 }}
                  style={{
                    position: 'absolute',
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                  }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex flex-col justify-center items-center border p-1 shrink-0 transition-transform active:scale-95 focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer z-20`}
                >
                  <span className="text-2xl pointer-events-none select-none">{item.icon}</span>
                  <span className="text-[7.5px] font-mono font-bold leading-none mt-1 pointer-events-none text-center px-0.5 truncate max-w-full">
                    {item.name.split(' ')[0]}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          ))}

          {/* Completely Clean sign inside Bedroom Area when all items are cleared! */}
          {isFinished && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-[#2d1b4d]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-30"
            >
              <h3 className="text-2xl font-black text-[#fbbf24] tracking-tighter uppercase font-sans leading-none bold-header-main flex items-center gap-1.5 justify-center">
                ROOM TIDY!
              </h3>
              <p className="text-[11px] text-purple-100 font-medium mt-1 max-w-[200px]">
                Amazing job Chinakka! Your cleaning speed is a divine gift!
              </p>
            </motion.div>
          )}
        </div>

        {/* 3 Interactive Deposit Bins at bottom */}
        <div className="w-full grid grid-cols-3 gap-2.5 mt-2.5 z-25 relative">
          <button
            id="bin-dustbin"
            onClick={(e) => handleBinClick('dustbin', e)}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all bg-black/40 relative active:scale-98 cursor-pointer ${
              selectedItem?.targetBin === 'dustbin'
                ? 'border-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.3)] saturate-110'
                : 'border-purple-500/10 hover:bg-purple-900/10'
            }`}
          >
            <Trash2 className="w-6 h-6 text-zinc-400 mb-1" />
            <span className="text-[10px] font-bold font-mono tracking-wider">DUSTBIN</span>
            <span className="text-[8px] font-mono text-zinc-500">🗑️ Waste</span>
          </button>

          <button
            id="bin-laundry"
            onClick={(e) => handleBinClick('laundry', e)}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all bg-black/40 relative active:scale-98 cursor-pointer ${
              selectedItem?.targetBin === 'laundry'
                ? 'border-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.3)] saturate-110'
                : 'border-purple-500/10 hover:bg-purple-900/10'
            }`}
          >
            <Archive className="w-6 h-6 text-blue-400 mb-1" />
            <span className="text-[10px] font-bold font-mono tracking-wider">LAUNDRY</span>
            <span className="text-[8px] font-mono text-blue-500">🧺 Garment</span>
          </button>

          <button
            id="bin-shelf"
            onClick={(e) => handleBinClick('shelf', e)}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all bg-black/40 relative active:scale-98 cursor-pointer ${
              selectedItem?.targetBin === 'shelf'
                ? 'border-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.3)] saturate-110'
                : 'border-purple-500/10 hover:bg-purple-900/10'
            }`}
          >
            <Library className="w-6 h-6 text-amber-400 mb-1" />
            <span className="text-[10px] font-bold font-mono tracking-wider">SHELF</span>
            <span className="text-[8px] font-mono text-amber-500">📥 Organise</span>
          </button>
        </div>

        {/* Required Bottom Text: "if you complete you can acess" inside down part */}
        <div className="w-full text-center mt-3 border-t border-purple-500/10 pt-2 pointer-events-none select-none">
          <p className="text-xs sm:text-sm uppercase font-mono tracking-widest text-[#fbbf24] font-extrabold animate-pulse">
            if you complete you can acess
          </p>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="w-full flex items-center justify-end z-20">
        <button
          id="finish-cleaning-btn"
          onClick={(e) => {
            e.stopPropagation();
            const width = window.innerWidth;
            const height = window.innerHeight;
            triggerConfetti(width / 2, height / 2, 40);
            onComplete();
          }}
          disabled={!isFinished}
          className={`w-full p-3 text-xs tracking-widest font-black transition-all rounded-full h-[48px] ${
            isFinished
              ? 'bold-accent-button'
              : 'bg-purple-950/20 text-stone-600 border border-purple-900/10 cursor-not-allowed text-center'
          }`}
        >
          {isFinished ? 'PROCEED TO GIFTS 🎁' : 'CLEAN THE ROOM TO GAIN ACCESS'}
        </button>
      </div>
    </div>
  );
};
