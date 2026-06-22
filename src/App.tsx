import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, ChevronRight, Heart, HeartCrack, Maximize2, Minimize2 } from 'lucide-react';
import { ConfettiAndSparkles, ConfettiRef } from './components/ConfettiAndSparkles';
import { Benediction } from './components/Benediction';
import { MemoryLane } from './components/MemoryLane';
import { BirthdayCake } from './components/BirthdayCake';
import { CleaningGame } from './components/CleaningGame';
import { SiblingQuiz } from './components/SiblingQuiz';
import { GiftAndWish } from './components/GiftAndWish';
import { LastLetter } from './components/LastLetter';
import { INTRO_TEXTS } from './content/siteTexts';

export default function App() {
  // Navigation index for PowerPoint-style slides
  // -4: Intro Scene 1: "This app is for my best sister in the world"
  // -3: Intro Scene 2: "Many can be jeleous of you, but I am proud of you"
  // -2: Intro Scene 3: "Congrats on turning into 19, may all your wishes be fulfilled"
  // -1: Intro Scene 4: "Happy birthday chinnakka then start the app"
  // 1: Benediction & Bible Verse
  // 2: Memory Lane Carousel (8 Photos)
  // 3: Virtual Candle Blowing Cake
  // 4: Cleaning Game Intro + Game
  // 5: How Well Do You Know Elia? Quiz Game
  // 6: Gift Question & wish sealing
  // 7: Heartfelt message scroll letter (Last Letter)
  const [slideIndex, setSlideIndex] = useState(-4);

  // Cleaning Game intro timer state
  const [showCleaningIntro, setShowCleaningIntro] = useState(false);

  // Shared state values for final report card
  const [savedGift, setSavedGift] = useState('');
  const [savedWish, setSavedWish] = useState('');

  // Ref for programmatically shooting confetti bursts on transitions or actions
  const confettiRef = useRef<ConfettiRef | null>(null);

  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    }
  };

  // HTML5 Fullscreen state and handler
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn(`Fullscreen exit error: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Automatically trigger confetti when the cover slide loads!
  useEffect(() => {
    if (slideIndex === 0) {
      const timer = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Launch a couple of massive bursts!
        confettiRef.current?.triggerBurst(width / 3, height * 0.4, 40);
        confettiRef.current?.triggerBurst((width * 2) / 3, height * 0.4, 40);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [slideIndex]);

  // Clean-up Intro slide timer:
  // "just put a line 'i know u like cleaning' in full screen and after 3 sec keep cleaning game only"
  useEffect(() => {
    if (slideIndex === 4) {
      setShowCleaningIntro(true);
      const timer = setTimeout(() => {
        setShowCleaningIntro(false);
        // Little bounce pop confetti when the clean room unlocks
        confettiRef.current?.triggerBurst(window.innerWidth / 2, window.innerHeight * 0.5, 12);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [slideIndex]);

  const handleNextSlide = () => {
    setSlideIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setSlideIndex(-4);
    setSavedGift('');
    setSavedWish('');
  };

  const manualTriggerConfetti = (x: number, y: number, count = 25) => {
    confettiRef.current?.triggerBurst(x, y, count);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-between overflow-hidden">
      {/* Decorative ambient background blur lights */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full filter blur-3xl pointer-events-none animate-pulse delay-700" />

      {/* Global Canvas Confetti Wrapper */}
      <ConfettiAndSparkles ref={confettiRef}>

        {/* Full-bleed responsive spacious website frame (expanded to full page max-w-5xl) */}
        <div className="w-full max-w-5xl min-h-screen mx-auto relative flex flex-col justify-between overflow-hidden select-none px-2 sm:px-4">
          {/* Main Content Screen Container */}
          <div className="flex-1 w-full overflow-hidden relative p-6 pt-10 pb-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {slideIndex === -4 && (
                <motion.div
                  key="slide-intro-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col justify-between select-none p-2 text-center text-white"
                  id="intro-step1-wrapper"
                >
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-purple-300 font-bold tracking-widest uppercase">
                    {INTRO_TEXTS.step1.badge}
                  </div>

                  <div className="my-auto space-y-6 py-8">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="text-7xl filter drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] select-none"
                    >
                      💖
                    </motion.div>
                    
                    <div className="space-y-4 max-w-lg mx-auto">
                      <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white uppercase font-sans">
                        {INTRO_TEXTS.step1.title1}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-[#fbbf24] to-yellow-400 font-extrabold filter drop-shadow-md">
                          {INTRO_TEXTS.step1.titleGradient}
                        </span><br />
                        {INTRO_TEXTS.step1.title2}
                      </h1>
                      <div className="h-0.5 w-16 bg-[#fbbf24]/50 mx-auto rounded-full mt-4" />
                      <p className="text-sm text-purple-100 max-w-sm mx-auto font-sans font-semibold leading-relaxed">
                        {INTRO_TEXTS.step1.desc}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      id="intro1-next-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        enterFullscreen();
                        manualTriggerConfetti(e.clientX, e.clientY, 20);
                        handleNextSlide();
                      }}
                      className="w-full bold-accent-button text-xs py-4 px-6 rounded-full flex items-center justify-center font-bold tracking-widest cursor-pointer shadow-2xl"
                    >
                      NEXT 🌟
                    </button>
                    <p className="text-[10px] text-[#fbbf24] font-mono mt-2 tracking-widest uppercase font-extrabold">
                      TAP SCREEN TO SOW SPARKLES ✨
                    </p>
                  </div>
                </motion.div>
              )}

              {slideIndex === -3 && (
                <motion.div
                  key="slide-intro-2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col justify-between select-none p-2 text-center text-white"
                  id="intro-step2-wrapper"
                >
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-purple-300 font-bold tracking-widest uppercase">
                    {INTRO_TEXTS.step2.badge}
                  </div>

                  <div className="my-auto space-y-6 py-8">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="text-7xl filter drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] select-none"
                    >
                      👑
                    </motion.div>

                    <div className="space-y-4 max-w-lg mx-auto">
                      <h1 className="text-3xl sm:text-[42px] font-black leading-tight tracking-tight text-white uppercase font-sans">
                        {INTRO_TEXTS.step2.title1}<br />
                        <span className="text-[#f43f5e] font-extrabold line-through decoration-[#fbbf24]/50">{INTRO_TEXTS.step2.titleStrike}</span>
                      </h1>
                      <div className="text-xs font-mono uppercase tracking-widest text-[#fbbf24] font-black my-2">
                        {INTRO_TEXTS.step2.divider}
                      </div>
                      <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 uppercase font-sans">
                        {INTRO_TEXTS.step2.title2}
                      </h1>
                      <div className="h-0.5 w-16 bg-[#fbbf24]/50 mx-auto rounded-full mt-4" />
                      <p className="text-sm text-purple-100 max-w-sm mx-auto font-sans font-semibold leading-relaxed">
                        {INTRO_TEXTS.step2.desc}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      id="intro2-next-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        enterFullscreen();
                        manualTriggerConfetti(e.clientX, e.clientY, 20);
                        handleNextSlide();
                      }}
                      className="w-full bold-accent-button text-xs py-4 px-6 rounded-full flex items-center justify-center font-bold tracking-widest cursor-pointer shadow-2xl"
                    >
                      CONTINUE 🌟
                    </button>
                    <p className="text-[10px] text-[#fbbf24] font-mono mt-2 tracking-widest uppercase font-extrabold animate-pulse">
                      HONOUR CONFERRED
                    </p>
                  </div>
                </motion.div>
              )}

              {slideIndex === -2 && (
                <motion.div
                  key="slide-intro-3"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col justify-between select-none p-2 text-center text-white"
                  id="intro-step3-wrapper"
                >
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-purple-300 font-bold tracking-widest uppercase">
                    {INTRO_TEXTS.step3.badge}
                  </div>

                  <div className="my-auto space-y-6 py-8">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="text-7xl filter drop-shadow-[0_0_20px_rgba(236,72,153,0.5)] select-none"
                    >
                      🎉
                    </motion.div>

                    <div className="space-y-5 max-w-lg mx-auto">
                      <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white uppercase font-sans">
                        {INTRO_TEXTS.step3.title}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-yellow-400 font-extrabold filter drop-shadow-md">
                          {INTRO_TEXTS.step3.titleGradient}
                        </span>
                      </h1>
                      <div className="h-0.5 w-16 bg-[#fbbf24]/50 mx-auto rounded-full my-3" />
                      <p className="text-sm sm:text-base text-purple-100 font-sans font-extrabold leading-relaxed italic px-4 select-text">
                        {INTRO_TEXTS.step3.desc}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      id="intro3-next-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        enterFullscreen();
                        manualTriggerConfetti(e.clientX, e.clientY, 20);
                        handleNextSlide();
                      }}
                      className="w-full bold-accent-button text-xs py-4 px-6 rounded-full flex items-center justify-center font-bold tracking-widest cursor-pointer shadow-2xl"
                    >
                      NEXT STEP 🌟
                    </button>
                    <p className="text-[10px] text-[#fbbf24] font-mono mt-2 tracking-widest uppercase font-extrabold">
                      HEAVENLY DECREE GRANTED
                    </p>
                  </div>
                </motion.div>
              )}

              {slideIndex === -1 && (
                <motion.div
                  key="slide-intro-4"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col justify-between select-none p-2 text-center text-white"
                  id="intro-step4-wrapper"
                >
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-purple-300 font-bold tracking-widest uppercase">
                    {INTRO_TEXTS.step4.badge}
                  </div>

                  <div className="my-auto space-y-8 py-8">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="text-7xl filter drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] select-none animate-bounce"
                    >
                      🎂
                    </motion.div>

                    <div className="space-y-4 max-w-lg mx-auto">
                      <h1 className="text-4xl sm:text-6xl font-black leading-none tracking-tight text-[#fbbf24] font-sans uppercase bold-header-main drop-shadow-lg">
                        {INTRO_TEXTS.step4.title}<br />
                        <span className="text-white">{INTRO_TEXTS.step4.subtitle}</span>
                      </h1>
                      <div className="h-1 w-20 bg-[#fbbf24]/60 mx-auto rounded-full mt-3" />
                      <p className="text-xs sm:text-sm text-purple-200/90 font-mono tracking-wide mt-2">
                        {INTRO_TEXTS.step4.desc}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      id="intro4-next-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        enterFullscreen();
                        const w = window.innerWidth;
                        const h = window.innerHeight;
                        manualTriggerConfetti(w / 3, h * 0.4, 30);
                        manualTriggerConfetti((w * 2) / 3, h * 0.4, 30);
                        setSlideIndex(1); // Takes them straight to the App (slideIndex 1) !
                      }}
                      className="w-full bold-accent-button text-xs py-4 px-6 rounded-full flex items-center justify-center font-bold tracking-widest cursor-pointer shadow-2xl animate-pulse"
                    >
                      {INTRO_TEXTS.step4.btn}
                    </button>
                    <p className="text-[10px] text-[#fbbf24] font-mono mt-2 tracking-widest uppercase font-extrabold">
                      {INTRO_TEXTS.step4.footer}
                    </p>
                  </div>
                </motion.div>
              )}

              {slideIndex === 1 && (
                <motion.div
                  key="slide-benediction"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <Benediction onComplete={handleNextSlide} triggerConfetti={manualTriggerConfetti} />
                </motion.div>
              )}

              {slideIndex === 2 && (
                <motion.div
                  key="slide-memories"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <MemoryLane onComplete={handleNextSlide} triggerConfetti={manualTriggerConfetti} />
                </motion.div>
              )}

              {slideIndex === 3 && (
                <motion.div
                  key="slide-cake"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <BirthdayCake onComplete={handleNextSlide} triggerConfetti={manualTriggerConfetti} />
                </motion.div>
              )}

              {slideIndex === 4 && (
                <motion.div
                  key="slide-cleaning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <AnimatePresence mode="wait">
                    {showCleaningIntro ? (
                      <motion.div
                        key="cleaning-text-intro"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="h-full flex flex-col justify-center items-center text-center p-4 bg-gradient-to-b from-purple-950 via-slate-950 to-black rounded-3xl"
                        id="cleaning-intro-fullscreen"
                      >
                        <motion.div
                          animate={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-5xl mb-4 select-none"
                        >
                          🧹
                        </motion.div>
                        {/* Required text line requested exactly: "i know u like cleaning" in full screen */}
                        <h1 className="text-2.5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-200 via-purple-300 to-pink-300 tracking-wide uppercase drop-shadow-md select-text">
                          "i know u like cleaning"
                        </h1>
                        <div className="h-0.5 w-8 bg-purple-500/25 mt-3.5 rounded-full" />
                        <p className="text-[10px] text-purple-400 font-mono tracking-widest mt-3.5 animate-pulse uppercase">
                          unfolding mini game in 3 seconds...
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cleaning-actual-game"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="h-full"
                      >
                        <CleaningGame onComplete={handleNextSlide} triggerConfetti={manualTriggerConfetti} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {slideIndex === 5 && (
                <motion.div
                  key="slide-sibling-quiz"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <SiblingQuiz
                    onComplete={handleNextSlide}
                    triggerConfetti={manualTriggerConfetti}
                  />
                </motion.div>
              )}

              {slideIndex === 6 && (
                <motion.div
                  key="slide-gifts-wishes"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <GiftAndWish
                    onComplete={handleNextSlide}
                    triggerConfetti={manualTriggerConfetti}
                    onSaveGift={setSavedGift}
                    onSaveWish={setSavedWish}
                  />
                </motion.div>
              )}

              {slideIndex === 7 && (
                <motion.div
                  key="slide-last-letter"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <LastLetter
                    onRestart={handleRestart}
                    triggerConfetti={manualTriggerConfetti}
                    savedGift={savedGift}
                    savedWish={savedWish}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ConfettiAndSparkles>
    </div>
  );
}
