import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, Star, Heart, CheckCircle2, ChevronRight, EyeOff } from 'lucide-react';

interface SiblingQuizProps {
  onComplete: () => void;
  triggerConfetti: (x: number, y: number, count?: number) => void;
}

export const SiblingQuiz: React.FC<SiblingQuizProps> = ({ onComplete, triggerConfetti }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Question 1: Who is Elia's First friend in his life?
  const [friendAnswer, setFriendAnswer] = useState<string>('');
  const [friendError, setFriendError] = useState<boolean>(false);
  const [friendSuccess, setFriendSuccess] = useState<boolean>(false);

  // Question 2: What is Elia jealous of?
  const [selectedJealous, setSelectedJealous] = useState<string>('');
  const [jealousSubmitted, setJealousSubmitted] = useState<boolean>(false);

  // Question 3: Rating Elia as tammi (1 to 10)
  const [tammiRating, setTammiRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  // Question 4: Who is Elia for you?
  const [roleText, setRoleText] = useState<string>('');
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const handleQ1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendAnswer.toLowerCase().trim() === 'jasmine') {
      setFriendSuccess(true);
      setFriendError(false);
      triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 25);
      setTimeout(() => {
        setCurrentStep(2);
      }, 1500);
    } else {
      setFriendError(true);
      setFriendSuccess(false);
      // Auto shake error
      setTimeout(() => setFriendError(false), 2500);
    }
  };

  const handleQ2Select = (optionKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJealous(optionKey);
    setJealousSubmitted(true);
    triggerConfetti(e.clientX, e.clientY, 15);
    setTimeout(() => {
      setCurrentStep(3);
    }, 1800);
  };

  const handleRatingClick = (val: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTammiRating(val);
    setRatingSubmitted(true);
    triggerConfetti(e.clientX, e.clientY, 10 + val);
    setTimeout(() => {
      setCurrentStep(4);
    }, 1500);
  };

  const handleQ4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleText.trim()) return;
    
    triggerConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 40);
    setQuizFinished(true);
  };

  // Reusable Confidentiality Note Component
  const PrivateDisclaimer = () => (
    <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-black/40 border border-purple-500/10 text-[10px] text-purple-300 font-mono tracking-wider">
      <EyeOff className="w-3 h-3 text-[#fbbf24]" />
      <span>PROMISE: Elia cannot see anything you have chosen! 🔒</span>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 pb-6 bg-purple-950/20 text-white rounded-3xl" id="sibling-quiz-scene">
      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={`quiz-step-${currentStep}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="flex-1 my-3.5 flex flex-col justify-between overflow-y-auto rounded-2xl border-2 border-[#fbbf24]/30 shadow-[0_4px_20px_rgba(109,40,217,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black backdrop-blur-md p-5"
          >
            {/* Header progress info */}
            <div className="text-center space-y-1 mb-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#fbbf24] uppercase">
                ⚡ SIBLING COVENANT TRIVIA • STAGE {currentStep} OF 4
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-sans">
                HOW WELL DO YOU KNOW ELIA? 🤔
              </h2>
            </div>

            {/* Questions wrapper */}
            <div className="flex-1 flex flex-col justify-center py-2">
              {currentStep === 1 && (
                <div className="space-y-5 max-w-sm mx-auto w-full">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-bold text-purple-100 uppercase tracking-wide">
                      Question 1: Who is Elia's First friend in his life?
                    </p>
                    <div className="inline-block px-3 py-1 bg-purple-900/40 border border-purple-500/20 rounded-lg text-xs font-sans text-[#fbbf24]">
                      Hint: In her name also It is mine (all are in small cases)
                    </div>
                  </div>

                  <form onSubmit={handleQ1Submit} className="space-y-4">
                    <input
                      type="text"
                      value={friendAnswer}
                      onChange={(e) => setFriendAnswer(e.target.value)}
                      placeholder="Type correct friend here..."
                      autoFocus
                      required
                      className="w-full text-center bg-black/60 border border-purple-500/30 focus:border-[#fbbf24] rounded-xl py-2.5 px-4 text-sm font-sans font-black text-[#fbbf24] focus:outline-none transition-all"
                    />

                    <AnimatePresence>
                      {friendError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-center text-xs text-rose-300 font-bold font-mono"
                        >
                          Oops! That's not correct! Read the hint carefully 🤭
                        </motion.p>
                      )}
                      {friendSuccess && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-xs text-emerald-300 font-bold font-mono flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />
                          Spot on! Heading to next stage...
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {!friendSuccess && (
                      <button
                        type="submit"
                        className="w-full bold-accent-button text-xs py-2.5 rounded-full flex items-center justify-center font-bold tracking-widest cursor-pointer shadow-md"
                      >
                        VERIFY ANSWER 🚀
                      </button>
                    )}
                  </form>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 max-w-sm mx-auto w-full">
                  <div className="text-center">
                    <p className="text-sm font-bold text-purple-100 uppercase tracking-wide">
                      Question 2: What is Elia jealous of?
                    </p>
                    <p className="text-[10px] text-purple-300 italic mt-1 font-mono">
                      (Tap any option to choose!)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { key: 'a', label: 'a. cleaning', text: 'Cleaning things perfectly' },
                      { key: 'b', label: 'b. costly things', text: 'Costly premium items' },
                      { key: 'c', label: 'c. piano', text: 'Spiritual Piano skills' },
                      { key: 'd', label: 'd. deevena', text: 'Deevena (His awesome best chinnakka!)' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={(e) => handleQ2Select(item.key, e)}
                        disabled={jealousSubmitted}
                        className={`w-full text-left p-2.5 px-4 rounded-xl border font-sans text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                          selectedJealous === item.key
                            ? 'bg-[#6d28d9]/35 border-[#fbbf24] text-[#fbbf24] font-black'
                            : 'bg-black/20 border-purple-500/10 hover:bg-purple-900/10'
                        }`}
                      >
                        <span>{item.label}</span>
                        {selectedJealous === item.key && <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {jealousSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-xl bg-purple-900/30 border border-purple-500/15 text-center text-xs"
                      >
                        {selectedJealous === 'd' ? (
                          <p className="text-[#fbbf24] font-bold">
                            Hahaha true sibling jealousy! Chinakka is always the favorite! 🤣💜
                          </p>
                        ) : selectedJealous === 'c' ? (
                          <p className="text-purple-200">
                            He loves playing the piano though, but you might play it better! 🎹
                          </p>
                        ) : (
                          <p className="text-purple-200">
                            Interesting choice! Sister's aura is unmatched! ✨
                          </p>
                        )}
                        <p className="text-[9px] text-[#fbbf24] animate-pulse mt-1 font-mono uppercase">
                          loading stage 3...
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 max-w-sm mx-auto w-full text-center">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-purple-100 uppercase tracking-wide">
                      Question 3: How do you rate Elia as your tammi from 1 to 10?
                    </p>
                    <p className="text-[10px] text-[#fbbf24] font-mono uppercase tracking-widest font-semibold">
                      (Tap or hover stars to rate!)
                    </p>
                  </div>

                  {/* Rating block 10 stars */}
                  <div className="flex items-center justify-center gap-1.5 my-3.5 flex-wrap">
                    {Array.from({ length: 10 }).map((_, index) => {
                      const ratingVal = index + 1;
                      const isHighlighted = ratingVal <= (hoverRating || tammiRating);
                      return (
                        <button
                          key={ratingVal}
                          type="button"
                          onMouseEnter={() => setHoverRating(ratingVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={(e) => handleRatingClick(ratingVal, e)}
                          disabled={ratingSubmitted}
                          className="p-1 focus:outline-none transition-transform active:scale-90"
                        >
                          <Star
                            className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-150 ${
                              isHighlighted
                                ? 'fill-[#fbbf24] stroke-[#fbbf24] filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                : 'stroke-purple-400 fill-transparent opacity-40'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="h-10">
                    <AnimatePresence>
                      {tammiRating > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-0.5"
                        >
                          <p className="text-sm font-black text-white">
                            Selected Rating: <span className="text-[#fbbf24] text-base">{tammiRating} / 10</span> ⭐
                          </p>
                          <p className="text-[10px] text-purple-200 mt-1 font-bold">
                            {tammiRating >= 8 
                              ? 'Best sister-brother bond ever! 🥹❤️' 
                              : tammiRating >= 5 
                              ? 'Quite generous Chinakka, thank you! 💜' 
                              : 'Ouch, looks like he needs to do more laundry chores! 😂'
                            }
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4 max-w-sm mx-auto w-full">
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-purple-100 uppercase tracking-wide">
                      Question 4: Who is Elia for you?
                    </p>
                    <p className="text-[10px] text-[#fbbf24] font-mono uppercase tracking-widest font-semibold leading-none">
                      (Write your heart out, sister!)
                    </p>
                  </div>

                  <form onSubmit={handleQ4Submit} className="space-y-3.5">
                    <textarea
                      value={roleText}
                      onChange={(e) => setRoleText(e.target.value)}
                      placeholder="My annoying but dearest spiritual brother, who is..."
                      rows={3}
                      required
                      className="w-full bg-black/55 border border-purple-500/30 focus:border-[#fbbf24] rounded-xl p-3 text-xs sm:text-sm text-purple-100 placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-[#fbbf24] leading-relaxed resize-none shadow-inner"
                    />

                    <button
                      type="submit"
                      disabled={!roleText.trim()}
                      className={`w-full py-2.5 rounded-full text-xs font-black tracking-widest shadow-md transition-all flex items-center justify-center gap-1.5 ${
                        roleText.trim()
                          ? 'bold-accent-button'
                          : 'bg-purple-950/20 text-stone-600 border border-purple-900/10 cursor-not-allowed'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                      COMPLETE GAME 🎉
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Private Disclaimer Footer for every question */}
            <div className="mt-3 text-center flex flex-col items-center gap-1">
              <PrivateDisclaimer />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-finished-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 my-3.5 flex flex-col justify-between rounded-2xl border-2 border-[#fbbf24]/30 shadow-[0_4px_20px_rgba(109,40,217,0.3)] bg-gradient-to-b from-[#2d1b4d] to-black backdrop-blur-md p-6 text-center select-none"
          >
            <div />

            <div className="space-y-4 max-w-sm mx-auto">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="text-6xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] select-none"
              >
                👑
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase font-sans leading-none bold-header-main">
                TRIVIA UNLOCKED!
              </h3>
              <p className="text-xs sm:text-sm text-purple-200/95 font-medium leading-relaxed font-sans max-w-[280px] mx-auto select-text">
                That was so fun! Deevena knows Elia so incredibly well. Let us carry forward to redeem your beautiful custom birthday gifts and seal your sacred spiritual wish!
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full bold-accent-button text-xs py-3.5 px-6 rounded-full flex items-center justify-center font-black tracking-widest cursor-pointer shadow-2xl mt-4"
            >
              PROCEED TO GIFTS & WISHES 🎁✨
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
