import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw, Lock, Unlock, HelpCircle } from 'lucide-react';
import { LAST_LETTER_TEXTS } from '../content/siteTexts';

interface LastLetterProps {
  onRestart: () => void;
  triggerConfetti: (x: number, y: number, count?: number) => void;
  savedGift: string;
  savedWish: string;
}

export const LastLetter: React.FC<LastLetterProps> = ({
  onRestart,
  triggerConfetti,
  savedGift,
  savedWish,
}) => {
  // Password flow states
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === 'deevena') {
      setIsUnlocked(true);
      setShowError(false);
      // Shoot dynamic fullscreen fireworks!
      const width = window.innerWidth;
      const height = window.innerHeight;
      triggerConfetti(width / 2, height / 2, 60);
      setTimeout(() => triggerConfetti(width / 3, height * 0.4, 30), 250);
      setTimeout(() => triggerConfetti((width * 2) / 3, height * 0.4, 30), 500);
    } else {
      setShowError(true);
      // Auto dismiss error after some seconds
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 pb-6 bg-purple-950/20 text-white rounded-3xl" id="last-letter-scene">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="password-gate-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex-1 my-3.5 flex flex-col justify-center items-center overflow-y-auto rounded-2xl border-2 border-[#fbbf24]/30 bg-gradient-to-b from-[#2d1b4d] via-[#1a0e30] to-black p-6 relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.06)_0%,transparent_70%)] pointer-events-none" />

            {/* Glowing neon lock logo */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full bg-purple-900/40 border border-[#fbbf24]/40 flex items-center justify-center text-[#fbbf24] shadow-[0_0_20px_rgba(251,191,36,0.25)] mb-6"
            >
              <Lock className="w-8 h-8 animate-pulse" />
            </motion.div>

            <div className="text-center space-y-2 mb-6 max-w-sm">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase font-sans">
                ENTER COVENANT CODE 🔐
              </h2>
              <p className="text-xs text-purple-250 font-mono uppercase tracking-widest leading-normal">
                An intimate question to unlock your last birthday message
              </p>
            </div>

            {/* Password Verification form */}
            <form onSubmit={handleVerifyPassword} className="w-full max-w-sm space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#a78bfa] uppercase tracking-widest flex items-center gap-1.5 justify-center">
                  <HelpCircle className="w-3.5 h-3.5 text-[#fbbf24]" />
                  Question: Elia's best sister name
                </label>
                
                <input
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (showError) setShowError(false);
                  }}
                  autoFocus
                  placeholder="Enter secret word..."
                  className="w-full text-center bg-black/60 border-2 border-[#fbbf24]/40 hover:border-[#fbbf24] focus:border-[#fbbf24] rounded-xl py-3 px-4 text-sm font-sans font-black text-[#fbbf24] placeholder-purple-300/25 tracking-wider focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all uppercase"
                />
              </div>

              {/* Error feedback banner */}
              <AnimatePresence>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold text-center leading-relaxed"
                  >
                    Incorrect sister name! Try again 🤭💜
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="w-full bold-accent-button text-xs py-3.5 px-6 rounded-full flex items-center justify-center font-black tracking-widest cursor-pointer shadow-lg active:scale-98 transition-transform"
              >
                UNLOCK SECURED KEY 🔑
              </button>

              <div className="text-center pt-2">
                <p className="text-[11px] text-[#fbbf24] font-semibold italic">
                  hint: all letters in small case
                </p>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked-parchment-letter"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 my-3.5 flex flex-col justify-between overflow-y-auto rounded-2xl border-2 border-[#fbbf24]/30 shadow-[0_4px_20px_rgba(109,40,217,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black backdrop-blur-md p-4 scrollbar-hidden relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Small floating hearts in background */}
            <div className="absolute top-10 left-5 text-[#fbbf24]/25 animate-bounce select-none text-xl pointer-events-none">❤️</div>
            <div className="absolute top-40 right-4 text-purple-400/25 animate-pulse select-none text-2xl pointer-events-none">💜</div>
            <div className="absolute bottom-16 left-6 text-[#fbbf24]/15 animate-ping select-none text-lg pointer-events-none">✨</div>

            {/* Animated Unlock Confirmation */}
            <div className="text-center relative z-10">
              <h2 className="text-3xl font-black text-white tracking-widest uppercase font-sans leading-none bold-header-main">
                {LAST_LETTER_TEXTS.headerName}
              </h2>
              <p className="text-xs text-[#fbbf24] font-mono uppercase tracking-widest font-extrabold mt-1">
                {LAST_LETTER_TEXTS.headerCap}
              </p>
            </div>

            {/* Scrollable Letter Pane */}
            <div className="flex-1 my-3.5 p-4 rounded-xl border border-[#fbbf24]/20 bg-black/40 overflow-y-auto sm:max-h-[300px] max-h-[280px] shadow-inner relative text-left scrollbar-thin scrollbar-thumb-purple-900">
              <div className="space-y-4 text-purple-100 font-sans text-sm sm:text-base leading-relaxed font-semibold select-text">
                <p className="font-extrabold uppercase tracking-wider text-[#fbbf24] text-base font-sans">
                  {LAST_LETTER_TEXTS.salutation}
                </p>

                {LAST_LETTER_TEXTS.letterBody.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}

                <div className="pt-2 border-t border-purple-500/15">
                  <p className="font-bold text-[#fbbf24] uppercase tracking-wider text-sm">
                    {LAST_LETTER_TEXTS.signOffTitle}
                  </p>
                  <p className="font-mono font-bold text-white mt-1 flex items-center gap-1 text-[15px]">
                    {LAST_LETTER_TEXTS.signOffSender}
                  </p>
                </div>
              </div>
            </div>

            {/* Saved States Display Box */}
            {(savedGift || savedWish) && (
              <div className="border border-[#fbbf24]/20 bg-[#6d28d9]/10 p-2 rounded-xl text-left space-y-1 select-text">
                <p className="text-[8px] font-mono tracking-widest uppercase text-[#fbbf24] font-extrabold">Captured Covenants:</p>
                {savedGift && (
                  <p className="text-[9px] font-mono text-purple-250 truncate">
                    🎁 Gift Request: <span className="text-[#fbbf24] font-semibold">{savedGift}</span>
                  </p>
                )}
                {savedWish && (
                  <p className="text-[9px] font-mono text-purple-250 truncate">
                    🙏 Sealed Wish: <span className="text-[#fbbf24] font-semibold">"{savedWish}"</span>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restart Button row */}
      {isUnlocked && (
        <div className="z-20 relative flex items-center gap-3">
          <button
            id="restart-presentation-btn"
            onClick={(e) => {
              e.stopPropagation();
              const width = window.innerWidth;
              const height = window.innerHeight;
              triggerConfetti(width / 2, height / 2, 35);
              onRestart();
            }}
            className="w-full bold-accent-button text-xs py-3 rounded-full flex items-center justify-center font-black tracking-widest cursor-pointer shadow-2xl"
          >
            REPLAY THE JOURNEY
          </button>
        </div>
      )}
    </div>
  );
};
