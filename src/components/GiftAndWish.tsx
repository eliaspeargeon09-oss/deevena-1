import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Heart, Send, CheckCircle2, Award, Sparkles, Milestone } from 'lucide-react';
import { GiftOption } from '../types';
import { GIFT_WISH_TEXTS } from '../content/siteTexts';

interface GiftAndWishProps {
  onComplete: () => void;
  triggerConfetti: (x: number, y: number, count?: number) => void;
  onSaveGift: (gift: string) => void;
  onSaveWish: (wish: string) => void;
}

const GIFT_OPTIONS: GiftOption[] = GIFT_WISH_TEXTS.options;

export const GiftAndWish: React.FC<GiftAndWishProps> = ({
  onComplete,
  triggerConfetti,
  onSaveGift,
  onSaveWish,
}) => {
  // Mode can be GIFT, WISH, WISH_APOLOGY or WISH_SEALED
  const [mode, setMode] = useState<'GIFT' | 'WISH' | 'WISH_APOLOGY' | 'WISH_SEALED'>('GIFT');

  // Gift selections state
  const [selectedGiftId, setSelectedGiftId] = useState<string>('watch');
  const [customGiftText, setCustomGiftText] = useState<string>('');
  const [isGiftSubmitted, setIsGiftSubmitted] = useState<boolean>(false);

  // Wish selections state
  const [wishText, setWishText] = useState<string>('');
  const [isSealing, setIsSealing] = useState<boolean>(false);

  const handleSelectGift = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGiftId(id);
    triggerConfetti(e.clientX, e.clientY, 12);
  };

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGiftObj = GIFT_OPTIONS.find((g) => g.id === selectedGiftId);
    const finalGiftChoice =
      selectedGiftId === 'other'
        ? (customGiftText.trim() || 'A custom gift option')
        : `${selectedGiftObj?.name || selectedGiftId}`;

    onSaveGift(finalGiftChoice);
    setIsGiftSubmitted(true);

    const width = window.innerWidth;
    const height = window.innerHeight;
    triggerConfetti(width / 2, height / 2, 30);
  };

  const handleSealWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    setIsSealing(true);
    onSaveWish(wishText.trim());

    // Run beautiful wax sealing duration animation
    setTimeout(() => {
      setIsSealing(false);
      setMode('WISH_APOLOGY');
      const width = window.innerWidth;
      const height = window.innerHeight;
      triggerConfetti(width / 2, height * 0.4, 60);
      setTimeout(() => triggerConfetti(width / 3, height * 0.5, 30), 200);
      setTimeout(() => triggerConfetti((width * 2) / 3, height * 0.5, 30), 400);
    }, 2000);
  };

  return (
    <div className="w-full h-full text-white" id="gift-and-wish-component">
      <AnimatePresence mode="wait">
        {mode === 'GIFT' && (
          <motion.div
            key="gift-sub-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col justify-between p-4 pb-6 bg-purple-950/20 rounded-3xl"
          >
            {/* Gift selector Stage */}
            <div className="flex-1 my-3.5 flex flex-col justify-between overflow-y-auto rounded-2xl border-2 border-[#fbbf24]/30 shadow-[0_4px_20px_rgba(109,40,217,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black backdrop-blur-md p-4 scrollbar-hidden">
              {!isGiftSubmitted ? (
                <>
                  <div className="text-center mb-3">
                    <h3 className="text-2xl font-black text-white tracking-widest uppercase font-sans leading-none bold-header-main">
                      {GIFT_WISH_TEXTS.title}
                    </h3>
                    <p className="text-[10px] text-[#fbbf24] mt-1 font-mono uppercase tracking-widest font-extrabold">
                      {GIFT_WISH_TEXTS.subtitle}
                    </p>
                  </div>

                  {/* Gift Grid Options list */}
                  <div className="space-y-2 flex-1 overflow-y-auto pr-0.5 max-h-[220px] scrollbar-thin scrollbar-thumb-purple-900">
                    {GIFT_OPTIONS.map((gift) => (
                      <button
                        key={gift.id}
                        type="button"
                        onClick={(e) => handleSelectGift(gift.id, e)}
                        className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                          selectedGiftId === gift.id
                            ? 'bg-[#6d28d9]/35 border-[#fbbf24] shadow-md ring-1 ring-[#fbbf24]/40'
                            : 'bg-black/20 border-purple-500/10 hover:bg-purple-900/20 hover:border-purple-500/30'
                        }`}
                      >
                        <span className="text-2xl select-none">{gift.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-white flex items-center justify-between">
                            {gift.name}
                            {selectedGiftId === gift.id && <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />}
                          </h4>
                          <p className="text-xs text-purple-205 leading-relaxed mt-1">
                            {gift.description}
                          </p>
                        </div>
                      </button>
                    ))}

                  </div>

                  {/* Context custom gift input box */}
                  {selectedGiftId === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2.5 overflow-hidden"
                    >
                      <input
                        id="custom-gift-input-val"
                        type="text"
                        placeholder="Write your custom gift option here..."
                        value={customGiftText}
                        onChange={(e) => setCustomGiftText(e.target.value)}
                        className="w-full bg-black/40 border-2 border-[#fbbf24]/40 rounded-xl px-3 py-2 text-xs font-sans text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-400 shadow-inner"
                      />
                    </motion.div>
                  )}

                  {/* Submission Row */}
                  <form onSubmit={handleGiftSubmit} className="mt-3.5">
                    <button
                      id="submit-gift-button-action"
                      type="submit"
                      className="w-full bold-accent-button py-2.5 rounded-full text-xs font-extrabold tracking-widest cursor-pointer shadow-2xl flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      SUBMIT SELECTION
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 w-full flex flex-col justify-between p-2 text-center" id="sibling-dialog-wrapper">
                  <div className="my-auto space-y-6 py-4">
                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="text-6xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] select-none"
                    >
                      {selectedGiftId === 'watch' ? '⌚' : selectedGiftId === 'phone_cover' ? '📱' : selectedGiftId === 'mobile_data' ? '📶' : '🎁'}
                    </motion.div>
                    
                    <div className="space-y-4 max-w-sm mx-auto">
                      <h3 className="text-xl font-black text-[#fbbf24] tracking-widest uppercase font-sans">
                        ELIA'S REPLY 💬
                      </h3>
                      
                      <div className="p-4 bg-purple-900/35 rounded-2xl border border-purple-500/20 shadow-inner">
                        <p className="text-sm sm:text-base text-purple-100 font-extrabold font-sans leading-relaxed italic select-text">
                          {selectedGiftId === 'watch' 
                            ? GIFT_WISH_TEXTS.dialogReplies.watch
                            : GIFT_WISH_TEXTS.dialogReplies.generic
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    id="submit-gift-continue-after-response"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerConfetti(e.clientX, e.clientY, 15);
                      setMode('WISH');
                    }}
                    className="w-full bold-accent-button py-3.5 px-6 rounded-full text-xs font-black tracking-widest cursor-pointer shadow-xl flex items-center justify-center gap-1.5 mt-4"
                  >
                    CONTINUE TO MAKE A WISH 🌟
                  </button>
                </div>
              )}
            </div>

            {/* Empty down footer for layout symmetry */}
            <div className="text-center">
              <span className="text-[9px] font-mono text-purple-400 tracking-wider">
                GIFT PREFERENCES STORED ON DEVICE
              </span>
            </div>
          </motion.div>
        )}

        {mode === 'WISH' && (
          <motion.div
            key="wish-make-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col justify-between p-4 pb-6 bg-purple-950/20 rounded-3xl"
          >
            {/* Stage */}
            <div className="flex-1 my-3.5 flex flex-col justify-between rounded-2xl border-2 border-[#fbbf24]/30 shadow-[0_4px_20px_rgba(109,40,217,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black backdrop-blur-md p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.08)_0%,transparent_70%)] pointer-events-none" />

              {!isSealing ? (
                <>
                  <div className="text-center mb-3">
                    <h3 className="text-2xl font-black text-white tracking-widest uppercase font-sans leading-none bold-header-main">
                      {GIFT_WISH_TEXTS.wishTitle}
                    </h3>
                    <p className="text-[10px] text-[#fbbf24] mt-1 font-mono uppercase tracking-widest font-extrabold">
                      {GIFT_WISH_TEXTS.wishSubtitle}
                    </p>
                  </div>

                  {/* Letter Envelope styled parchment textbox */}
                  <form onSubmit={handleSealWish} className="flex-1 flex flex-col justify-between my-1">
                    <div className="bg-black/45 border border-[#fbbf24]/20 p-3.5 rounded-xl flex-1 flex flex-col space-y-2 relative shadow-inner">
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full animate-ping" />
                        <span className="text-[7.5px] font-mono text-[#fbbf24] uppercase">COVENANT FILLED</span>
                      </div>

                      <textarea
                        id="covenant-wish-textarea-val"
                        rows={5}
                        placeholder={GIFT_WISH_TEXTS.wishPlaceholder}
                        value={wishText}
                        onChange={(e) => setWishText(e.target.value)}
                        required
                        className="w-full flex-1 bg-transparent text-purple-100 placeholder-purple-300/35 border-0 focus:ring-0 p-0 text-sm sm:text-base font-sans resize-none leading-relaxed focus:outline-none"
                      />

                      {/* Your reassuring promise of absolute secrecy */}
                      <div className="pt-2 border-t border-purple-500/10 text-center">
                        <p className="text-xs text-[#fbbf24] font-semibold font-sans italic leading-relaxed">
                          {GIFT_WISH_TEXTS.promiseText}
                        </p>
                      </div>
                    </div>

                    <button
                      id="seal-wish-button-trigger"
                      type="submit"
                      disabled={!wishText.trim()}
                      className={`w-full py-2.5 rounded-full font-sans text-xs font-black tracking-widest mt-4 shadow-lg transition-all flex items-center justify-center gap-2 ${
                        wishText.trim()
                          ? 'bold-accent-button'
                          : 'bg-purple-950/20 text-stone-600 border border-purple-900/10 cursor-not-allowed'
                      }`}
                    >
                      SEAL IN HEAVEN ⚜️
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <h3 className="text-2xl font-black text-[#fbbf24] tracking-tighter uppercase font-sans leading-none bold-header-main">
                    SEALING...
                  </h3>
                  <p className="text-[10px] text-purple-200 mt-2 max-w-[200px] font-mono uppercase font-bold tracking-widest">
                    Securing Deevena's wishes in divine chambers.
                  </p>
                </div>
              )}
            </div>

            {/* Empty down footer */}
            <div className="text-center">
              <span className="text-[9px] font-mono text-purple-400 tracking-wider">
                LOCKING ENVELOPE SEALS WITH SPIRITUAL INTEGRITY
              </span>
            </div>
          </motion.div>
        )}

        {mode === 'WISH_APOLOGY' && (
          <motion.div
            key="wish-apology-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="h-full flex flex-col justify-between p-4 pb-6 bg-gradient-to-b from-[#2d1b4d] via-purple-950 to-black text-center relative select-none rounded-3xl"
          >
            {/* Floating background glowing sparkles */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.1)_0%,transparent_80%)] pointer-events-none" />

            <div />

            {/* Apology message center quote card */}
            <div className="my-auto px-4 z-10 flex flex-col justify-center items-center space-y-6">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="text-6xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] select-none"
              >
                🎁
              </motion.div>
              
              <div className="space-y-4 max-w-sm sm:max-w-md mx-auto">
                <h3 className="text-xl font-black text-[#fbbf24] tracking-widest uppercase font-sans">
                  A MESSAGE FROM ELIA 💬
                </h3>
                
                <div className="p-4 sm:p-6 bg-purple-900/35 rounded-2xl border border-purple-500/20 shadow-inner">
                  <p className="text-sm sm:text-base text-purple-100 font-extrabold font-sans leading-relaxed italic select-text">
                    “{GIFT_WISH_TEXTS.lostDataApology}”
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Button */}
            <div className="z-20 relative px-2">
              <motion.button
                id="wish-apology-continue-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerConfetti(e.clientX, e.clientY, 35);
                  setMode('WISH_SEALED');
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bold-accent-button text-xs py-3.5 px-6 rounded-full flex items-center justify-center font-black tracking-widest cursor-pointer shadow-2xl"
              >
                CONTINUE TO FINAL BLESSING ✨
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === 'WISH_SEALED' && (
          <motion.div
            key="wish-sealed-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="h-full flex flex-col justify-between p-4 pb-6 bg-gradient-to-b from-[#2d1b4d] via-purple-950 to-black text-center relative select-none rounded-3xl"
          >
            {/* Floating background glowing sparkles */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15)_0%,transparent_80%)] pointer-events-none" />

            <div />

            {/* Big full-screen message centered requested: "May Lord fulfill your wish as per his will" */}
            <div className="my-auto px-4 z-10 flex flex-col justify-center items-center">
              <div className="mb-4 text-4xl">🕯️</div>
              
              {/* Big full-screen typography displaying: "May Lord fulfill your wish as per his will" */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl sm:text-4xl font-extrabold font-sans text-white leading-none tracking-tighter uppercase bold-header-main select-text mb-4 drop-shadow-2xl text-center"
              >
                “{GIFT_WISH_TEXTS.covenantSealedText}”
              </motion.h1>

              {/* Little verse detail representing the spiritual sister aspect */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-[10px] font-mono font-bold text-[#fbbf24] uppercase tracking-widest mt-2 bg-purple-900/40 border border-[#fbbf24]/30 px-3.5 py-1 rounded-full shadow-inner"
              >
                {GIFT_WISH_TEXTS.covenantRef}
              </motion.p>
            </div>

            {/* Navigation Button */}
            <div className="z-20 relative px-2">
              <motion.button
                id="finish-wish-fullscreen-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerConfetti(e.clientX, e.clientY, 35);
                  onComplete();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bold-accent-button text-xs py-3.5 px-6 rounded-full flex items-center justify-center font-black tracking-widest cursor-pointer shadow-2xl"
              >
                LAST LETTER 💌
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
