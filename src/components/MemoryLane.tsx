import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Upload, Sparkles, Image as ImageIcon, CheckCircle, FlameKindling, Maximize2, X } from 'lucide-react';
import { MemoryPhoto } from '../types';
import { MEMORY_LANE_TEXTS } from '../content/siteTexts';
import { MEMORY_PHOTOS } from '../media/mediaLinks';

interface MemoryLaneProps {
  onComplete: () => void;
  triggerConfetti: (x: number, y: number, count?: number) => void;
}

const DEFAULT_MEMORIES: Omit<MemoryPhoto, 'userImage'>[] = [
  {
    id: 1,
    title: MEMORY_LANE_TEXTS[0].title,
    message: MEMORY_LANE_TEXTS[0].message,
    defaultImage: MEMORY_PHOTOS.petLover,
  },
  {
    id: 2,
    title: MEMORY_LANE_TEXTS[1].title,
    message: MEMORY_LANE_TEXTS[1].message,
    defaultImage: MEMORY_PHOTOS.churchDon,
  },
  {
    id: 3,
    title: MEMORY_LANE_TEXTS[2].title,
    message: MEMORY_LANE_TEXTS[2].message,
    defaultImage: MEMORY_PHOTOS.gamer,
  },
  {
    id: 4,
    title: MEMORY_LANE_TEXTS[3].title,
    message: MEMORY_LANE_TEXTS[3].message,
    defaultImage: MEMORY_PHOTOS.pureHearted,
  },
  {
    id: 5,
    title: MEMORY_LANE_TEXTS[4].title,
    message: MEMORY_LANE_TEXTS[4].message,
    defaultImage: MEMORY_PHOTOS.angelTeaser,
  },
  {
    id: 6,
    title: MEMORY_LANE_TEXTS[5].title,
    message: MEMORY_LANE_TEXTS[5].message,
    defaultImage: MEMORY_PHOTOS.sundaySchoolTeacher,
  },
  {
    id: 7,
    title: MEMORY_LANE_TEXTS[6].title,
    message: MEMORY_LANE_TEXTS[6].message,
    defaultImage: MEMORY_PHOTOS.cryingFace,
  },
  {
    id: 8,
    title: MEMORY_LANE_TEXTS[7].title,
    message: MEMORY_LANE_TEXTS[7].message,
    defaultImage: MEMORY_PHOTOS.bestPicture,
  },
];

export const MemoryLane: React.FC<MemoryLaneProps> = ({ onComplete, triggerConfetti }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [memories, setMemories] = useState<MemoryPhoto[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Load customized memories if any exist in localStorage
    const loadedMemories = DEFAULT_MEMORIES.map((m) => {
      const userImg = localStorage.getItem(`saved_memory_photo_v2_${m.id}`);
      return {
        ...m,
        userImage: userImg || undefined,
      };
    });
    setMemories(loadedMemories);
  }, []);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      triggerConfetti(e.clientX, e.clientY, 20);
    }
    if (currentIndex < memories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerConfetti(e.clientX, e.clientY, 10);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const targetId = memories[currentIndex].id;

      localStorage.setItem(`saved_memory_photo_v2_${targetId}`, base64);
      setMemories((prev) =>
        prev.map((m) => (m.id === targetId ? { ...m, userImage: base64 } : m))
      );

      // Trigger sparkles
      if (fileInputRef.current) {
        const rect = fileInputRef.current.getBoundingClientRect();
        triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
      }
    };
    reader.readAsDataURL(file);
  };

  if (memories.length === 0) return null;

  const activeMemory = memories[currentIndex];
  const imageSrc = activeMemory.userImage || activeMemory.defaultImage;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 pb-6 bg-purple-950/20 text-white rounded-3xl" id="memory-lane-component">

      {/* Main Interactive Presentation Canvas: No-cut photo with gradient card */}
      <div className="flex-1 my-4 relative flex flex-col justify-center items-center overflow-hidden rounded-2xl border-2 border-[#fbbf24]/30 shadow-[0_4px_20px_rgba(109,40,217,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black backdrop-blur-md w-full aspect-[9/16] max-h-[72vh] mx-auto">
        {/* Full-bleed blurred ambient glow background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={imageSrc}
            alt="Ambient blur"
            className="w-full h-full object-cover filter blur-2xl scale-110 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-purple-950/50 to-purple-950/90" />
        </div>

        {/* The Actual Photo Frame - Fitted precisely to occupy the full container, ensuring no cutting */}
        <div className="relative z-10 w-full h-full flex-1 flex items-center justify-center select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMemory.id + (activeMemory.userImage ? '_user' : '_default')}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex justify-center items-center transition-all"
            >
              <img
                src={imageSrc}
                alt={activeMemory.title}
                className="w-full h-full object-cover pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Small Full-Screen Symbol at the bottom of the photo container */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFullScreen(true);
            triggerConfetti(e.clientX, e.clientY, 15);
          }}
          className="absolute bottom-4 right-4 z-30 bg-black/80 border border-[#fbbf24]/50 text-[#fbbf24] hover:text-white p-2.5 rounded-full hover:bg-purple-900 transition-all shadow-lg flex items-center justify-center cursor-pointer pointer-events-auto"
          title="Open Fullscreen View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Text Area Card Overlaid Bottom - Absolute positioned with a beautiful smooth delay transition to appear after the photo */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col justify-end pt-24 rounded-b-2xl pointer-events-none w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMemory.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
              className="space-y-1.5 pointer-events-auto"
            >
              <div className="text-[11px] sm:text-xs font-mono tracking-widest font-black text-[#fbbf24]/90 uppercase flex items-center gap-1 hover:text-white transition-colors bg-purple-950/40 w-fit px-2.5 py-1 rounded-full border border-[#fbbf24]/20 shadow-sm leading-none">
                <span>🎂 HAPPY BIRTHDAY CHINAKKA! 🎉</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#fbbf24] tracking-tighter font-sans uppercase bold-header-main flex items-center gap-1.5 leading-tight drop-shadow-md">
                {activeMemory.title}
              </h3>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-sans font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] min-h-[50px]">
                {activeMemory.message}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Full-Screen Lightbox Portal */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Top Bar with Title & Close button */}
            <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-10 py-2">
              <span className="text-xs text-[#fbbf24] font-mono tracking-widest font-extrabold uppercase bg-purple-950/60 px-3 py-1.5 rounded-full border border-[#fbbf24]/30">
                ✨ PHOTO FULLSCREEN VIEW
              </span>
              <button
                onClick={() => setIsFullScreen(false)}
                className="bg-purple-900/80 border border-[#fbbf24]/50 text-[#fbbf24] hover:text-white hover:bg-rose-900 px-3 py-1 rounded-full text-xs font-mono font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md"
              >
                <X className="w-4.5 h-4.5" />
                CLOSE
              </button>
            </div>

            {/* Main Image Frame - Mobile Screen 9:16 aspect constraint or max-height 80vh to be huge and detailed */}
            <div className="flex-1 w-full flex items-center justify-center my-4 overflow-hidden select-none">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative w-full max-w-md aspect-[9/16] h-full max-h-[85vh] rounded-2xl overflow-hidden border-2 border-[#fbbf24]/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black"
              >
                <img
                  src={imageSrc}
                  alt={activeMemory.title}
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Text overlay inside fullscreen photo */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/85 to-transparent p-6 pt-24 flex flex-col gap-1.5">
                  <div className="text-[11px] font-mono tracking-widest font-black text-[#fbbf24]/90 uppercase flex items-center gap-1 bg-purple-950/50 w-fit px-2.5 py-1 rounded-full border border-[#fbbf24]/20 shadow-sm leading-none">
                    <span>🎂 HAPPY BIRTHDAY CHINAKKA! 🎉</span>
                  </div>
                  <h3 className="text-xl font-black text-[#fbbf24] tracking-tighter uppercase font-sans leading-tight mb-0.5">
                    {activeMemory.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-100 font-extrabold font-sans leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    {activeMemory.message}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Slide Index display at very bottom */}
            <div className="w-full text-center py-2 z-10">
              <p className="text-xs text-[#fbbf24]/70 font-mono tracking-widest font-extrabold">
                CHINAKKA'S MEMORY LANE • PHOTO {currentIndex + 1} OF {memories.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Navigation Overlay button/bar */}
      <div className="flex items-center justify-between gap-3 mt-1 relative z-20">
        <button
          id="prev-memory-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex-1 max-w-[80px] py-3.5 rounded-full border-2 flex items-center justify-center transition-all duration-300 text-xs font-mono font-black tracking-wide shadow-md ${
            currentIndex === 0
              ? 'opacity-30 border-purple-950 text-purple-700 cursor-not-allowed bg-transparent'
              : 'border-[#fbbf24]/40 text-[#fbbf24] bg-purple-950/20 hover:bg-[#fbbf24]/10 active:scale-95'
          }`}
        >
          BACK
        </button>

        <button
          id="next-memory-btn"
          onClick={handleNext}
          className="flex-1 bold-accent-button text-xs py-3.5 px-6 rounded-full flex items-center justify-center font-extrabold tracking-widest cursor-pointer shadow-2xl"
        >
          {currentIndex === memories.length - 1 ? (
            "CELEBRATE ✨"
          ) : (
            "NEXT PHOTO ➔"
          )}
        </button>
      </div>

      {/* Hidden File Input for Image customization */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </div>
  );
};
