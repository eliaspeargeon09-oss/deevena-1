import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Scroll, ChevronRight } from 'lucide-react';
import { BENEDICTION_TEXTS } from '../content/siteTexts';

interface BenedictionProps {
  onComplete: () => void;
  triggerConfetti: (x: number, y: number, count?: number) => void;
}

export const Benediction: React.FC<BenedictionProps> = ({ onComplete, triggerConfetti }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 pb-6 bg-purple-950/20 text-white rounded-3xl" id="benediction-slide-layout">

      {/* Main Card Scroll Body */}
      <div className="flex-1 my-3.5 flex flex-col justify-between overflow-y-auto rounded-2xl border-2 border-[#fbbf24]/30 shadow-[0_4px_20px_rgba(109,40,217,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black backdrop-blur-md p-4 scrollbar-hidden">
        {/* Glowing cross outline and stars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.1)_0%,transparent_60%)] pointer-events-none" />

        {/* Illuminated Header representing spiritually bestest sister */}
        <div className="text-center relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-sans leading-none bold-header-main">
            SACRED<br/>BLESSING
          </h2>
          <p className="text-xs text-[#fbbf24] mt-1 font-mono uppercase tracking-widest font-extrabold">
            For Bestest Sister Spiritually
          </p>
        </div>

        {/* The Scroll Container inside */}
        <div className="my-3 py-3 px-3.5 bg-black/45 border border-[#fbbf24]/25 rounded-xl relative overflow-hidden flex-1 flex flex-col justify-center space-y-4 shadow-inner">
          {/* Sparkles embedded */}
          <div className="absolute top-1 left-2 text-[#fbbf24] text-xs animate-ping">✨</div>
          <div className="absolute bottom-1 right-2 text-[#fbbf24] text-xs animate-ping delay-1000">✨</div>

          {/* SCRIPTURE CHANT */}
          <div className="text-center space-y-2 border-b border-[#fbbf24]/20 pb-3">
            <div className="flex items-center justify-center gap-1 text-xs text-[#fbbf24] font-mono tracking-widest font-extrabold">
              <BookOpen className="w-3.5 h-3.5" />
              {BENEDICTION_TEXTS.verseRef}
            </div>
            <p className="text-sm sm:text-base md:text-lg font-serif font-bold italic text-white leading-relaxed max-w-[280px] mx-auto drop-shadow-sm select-text">
              {BENEDICTION_TEXTS.verse}
            </p>
          </div>

          {/* BENEDICTION PRAYER FROM HEART */}
          <div className="space-y-1">
            <div className="text-center text-[10px] text-[#a78bfa] font-mono tracking-widest font-extrabold uppercase">
              {BENEDICTION_TEXTS.subtitle}
            </div>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-purple-100/95 text-center font-sans font-medium select-text">
              {BENEDICTION_TEXTS.prayer}
            </p>
          </div>
        </div>

        {/* Summary text */}
        <div className="text-center relative z-10">
          <p className="text-[9px] font-mono text-[#fbbf24] tracking-widest uppercase font-black">
            WALKING IN COVENANT & SACRED VICTORY
          </p>
        </div>
      </div>

      {/* Slide Navigation footer */}
      <div className="flex items-center justify-end z-20">
        <button
          id="benediction-proceed-btn"
          onClick={(e) => {
            e.stopPropagation();
            triggerConfetti(e.clientX, e.clientY, 25);
            onComplete();
          }}
          className="w-full bold-accent-button py-3 text-xs rounded-full flex items-center justify-center tracking-widest font-extrabold cursor-pointer"
        >
          ENTER MEMORY LANE
        </button>
      </div>
    </div>
  );
};
