import React, { useState, useEffect, useRef } from 'react';

// Common Transition Wrapper
const PageWrapper: React.FC<{ children: React.ReactNode; pageDepth?: number; className?: string }> = ({ children, pageDepth = 0, className = "" }) => {
  // Easing shifts as depth increases
  const easing = pageDepth < 0.3 ? 'ease-out' : pageDepth < 0.7 ? 'ease-in-out' : 'linear';
  return (
    <div 
      className={`animate-in fade-in slide-in-from-bottom-2 duration-[1200ms] flex flex-col items-center ${className}`}
      style={{ transitionTimingFunction: easing }}
    >
      {children}
    </div>
  );
};

// Haptic feedback helper
const triggerHaptic = (duration: number = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

// Typewriter Component
const TypewriterText: React.FC<{ text: string; onComplete?: () => void; speed?: number; className?: string }> = ({ text, onComplete, speed = 40, className = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      const finalTimeout = setTimeout(onComplete, 800); // Added slight pause before next line
      return () => clearTimeout(finalTimeout);
    }
  }, [index, text, speed, onComplete]);

  return <p className={`animate-in fade-in duration-700 ${className}`}>{displayedText}</p>;
};

// Common Button Component
const RomanticButton: React.FC<{ onClick: () => void; label: string; delay?: number; depth?: number }> = ({ onClick, label, delay = 1200, depth = 0 }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Buttons appear after a pause to ensure text is read
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Shadow weakens as depth increases (Shadow as Weight)
  const shadowSpread = Math.max(0, 15 - (depth * 15));
  const shadowOpacity = Math.max(0, 0.22 - (depth * 0.22));

  if (depth === 1) return null; // No buttons on final page

  return (
    <button
      onClick={() => {
        triggerHaptic(15);
        onClick();
      }}
      className={`mt-14 px-10 py-3.5 rounded-full bg-[#E07A8C] text-[#FFF1F4] text-lg font-light tracking-wide transition-all duration-[800ms]
        hover:bg-[#E88FA0] hover:scale-[1.02] active:scale-[0.98]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ 
        boxShadow: `0 ${shadowSpread/2}px ${shadowSpread}px rgba(224, 122, 140, ${shadowOpacity})`,
      }}
    >
      {label}
    </button>
  );
};

// PAGE 0 - WARM WELCOME
export const LandingPage: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < 2) {
      const timer = setTimeout(() => setStep(s => s + 1), 1800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <PageWrapper pageDepth={0} className="relative">
      {/* Soft ambient glow behind landing text */}
      <div className="absolute inset-0 -z-10 bg-radial-gradient from-[rgba(255,228,234,0.4)] to-transparent blur-3xl opacity-60 scale-150"></div>
      
      <div className="space-y-8 mb-4">
        <h1 className="text-5xl ink-primary font-light tracking-tight animate-in fade-in duration-[1800ms] ease-out">
          Hi, Sannidhi.
        </h1>
        
        {step >= 1 && (
          <p className="text-2xl ink-secondary font-light animate-in fade-in slide-in-from-bottom-2 duration-[1500ms]">
            I made something for you.
          </p>
        )}
        
        {step >= 2 && (
          <p className="text-lg ink-whisper font-light animate-in fade-in slide-in-from-bottom-2 duration-[1500ms]">
            We can take this slow.
          </p>
        )}
      </div>

      <RomanticButton 
        label="I’m ready." 
        onClick={onNext} 
        delay={step >= 2 ? 1000 : 999999} // Only trigger countdown after all text is revealed
        depth={0} 
      />
    </PageWrapper>
  );
};

// PAGE 1
export const ConsentPage: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <PageWrapper pageDepth={0.1}>
    <p className="text-2xl ink-secondary font-light leading-relaxed">
      This is just something I wanted you to have.
    </p>
    <RomanticButton label="Okay." onClick={onNext} depth={0.1} />
  </PageWrapper>
);

// PAGE 2 - Heart Interaction
export const HeartActivityPage: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [taps, setTaps] = useState(0);
  const [showReveal, setShowReveal] = useState(false);

  useEffect(() => {
    if (taps >= 6 && !showReveal) {
      setTimeout(() => setShowReveal(true), 500);
      setTimeout(() => onNext(), 3500);
    }
  }, [taps, showReveal, onNext]);

  const handleTap = () => {
    triggerHaptic(10 + taps * 2);
    setTaps(t => t + 1);
  };

  return (
    <PageWrapper pageDepth={0.2}>
      <p className="text-2xl ink-primary font-light mb-2">Before I say more, take a moment.</p>
      <p className="text-sm ink-whisper mb-14">Tap the heart when you're ready to feel loved.</p>
      
      <div 
        onClick={handleTap}
        className="cursor-pointer transition-transform duration-500 animate-soft-pulse"
        style={{ transform: `scale(${1 + taps * 0.05})` }}
      >
        <div className="hover:brightness-110 transition-all duration-700">
          <svg 
            width="90" height="90" viewBox="0 0 24 24" fill={taps > 0 ? "#E88FA0" : "#E07A8C"} 
            className="drop-shadow-sm transition-colors duration-700"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>

      {showReveal && (
        <p className="mt-14 text-xl ink-secondary animate-in fade-in slide-in-from-top-2 duration-[1500ms] italic">
          You always make space for me like this.
        </p>
      )}
    </PageWrapper>
  );
};

// PAGE 3 - Gratitude Sequential
export const GratitudePage: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [step, setStep] = useState(0);
  const lines = [
    "There's a quiet way you move through everyday life that changes the people around you.",
    "You don't rush, you don't push — you just make things feel calmer, clearer, more possible.",
    "Being close to you has made me more confident in my own life, without you ever trying to teach me how."
  ];

  useEffect(() => {
    if (step < lines.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 3200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <PageWrapper pageDepth={0.3}>
      <div className="space-y-10 text-xl ink-secondary font-light leading-relaxed" style={{ letterSpacing: '0.005em' }}>
        {lines.slice(0, step + 1).map((line, i) => (
          <p key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-[1500ms]">
            {line}
          </p>
        ))}
      </div>
      {step === lines.length - 1 && <RomanticButton label="Next." onClick={onNext} depth={0.4} />}
    </PageWrapper>
  );
};

// PAGE 4 - Drag to Reveal
export const DragRevealPage: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [progress, setProgress] = useState(0);
  const sentence = "Loving you has quietly taught me how to trust myself.";
  const words = sentence.split(" ");
  const revealedWords = Math.floor((progress / 100) * words.length);
  const lastHapticProgress = useRef(0);

  useEffect(() => {
    if (Math.abs(progress - lastHapticProgress.current) >= 8) {
      triggerHaptic(4);
      lastHapticProgress.current = progress;
    }
    if (progress >= 100) {
      triggerHaptic(20);
      setTimeout(() => onNext(), 2200);
    }
  }, [progress, onNext]);

  return (
    <PageWrapper pageDepth={0.5}>
      <p className="text-2xl ink-primary font-light mb-2">Take this slow.</p>
      <p className="text-sm ink-whisper mb-14">Drag when you're ready.</p>
      
      <div className="min-h-[120px] flex flex-wrap justify-center gap-x-3 gap-y-2 mb-14">
        {words.map((word, i) => (
          <span 
            key={i} 
            className={`text-2xl transition-all duration-1000 ${i <= revealedWords ? 'opacity-100 blur-0 translate-y-0 ink-primary' : 'opacity-0 blur-md translate-y-3'}`}
          >
            {word}
          </span>
        ))}
      </div>

      <input 
        type="range" 
        min="0" 
        max="100" 
        value={progress}
        onChange={(e) => setProgress(Number(e.target.value))}
        className="w-full h-1 bg-[#E07A8C]/10 rounded-lg appearance-none cursor-pointer accent-[#E07A8C] transition-all"
        style={{ opacity: 0.8 }}
      />
    </PageWrapper>
  );
};

// PAGE 5 - Core Confession
export const ConfessionPage: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  
  useEffect(() => {
    if (visibleLines < 3) {
      const timer = setTimeout(() => setVisibleLines(v => v + 1), 2800);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => onNext(), 6500);
    }
  }, [visibleLines, onNext]);

  return (
    <PageWrapper pageDepth={0.7}>
      <div className="space-y-14">
        {visibleLines >= 1 && <h2 className="text-5xl ink-primary font-light animate-in fade-in duration-[2500ms]">Sannidhi, I love you ❤️</h2>}
        {visibleLines >= 2 && <p className="text-xl ink-primary font-light animate-in fade-in duration-[2500ms] leading-relaxed">Not just for how you make me feel, but for how you've become part of how I live.</p>}
        {visibleLines >= 3 && <p className="text-xl ink-primary font-light animate-in fade-in duration-[2500ms] leading-relaxed">I choose you — with gratitude, with certainty, and with all the calm you've brought into my life.</p>}
      </div>
    </PageWrapper>
  );
};

// PAGE 6 - Assurance
export const AssurancePage: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <PageWrapper pageDepth={0.8}>
    <div className="space-y-10 text-xl ink-secondary font-light leading-relaxed">
      <p>Nothing about this changes the quiet parts of us.</p>
      <p>I'm still here — in the ordinary days, the unsure moments, and everything in between.</p>
      <p>You don't have to hold anything differently. I just wanted you to know.</p>
    </div>
    <RomanticButton label="Stay." onClick={onNext} depth={0.8} />
  </PageWrapper>
);

// PAGE 7 - Final Letter
export const FinalLetterPage: React.FC = () => {
  const [visibleParagraphs, setVisibleParagraphs] = useState(1);
  const letterData = [
    "My dear Sannidhi Putta,❤️,",
    "I may never be able to tell you this, but I feel like I've already married you. ❤️🧎🏻",
    "Not in a temple, 🛕 not in front of people, but deep inside my heart.🌸❤️",
    "I married your soul the day you understood my feelings. 🪷❤️",
    "I married your smile when it healed my chaos. 😌🌝",
    "I married your presence when it became my peace. ☮️",
    "Because love isn't about rituals or rings. 💍 🔥",
    "It's about choosing each other every single day, 🌝through every fight, 🫠every tear, 🥹every distance. 🫠",
    "When two souls stay loyal, when they never give up on each other. 🥹😌🔥❤️🌸🪷",
    "That's marriage. 🌸🪷🤩🥹❤️🌝",
    "Pure. Real. Eternal. 🔥🔥🧿🧿🌸🪷",
    "Like the one you've already married by heart.💓❤️🌸🧿",
    "I will choose you, even when life gets harder !",
    "I promise to hold you when days feel heavy, and laugh with you when they feel right!",
    "I’ll celebrate your wins ! And stay even when things get messy!",
    "I don’t promise perfection! Just honesty, efforts and live that keeps choosing YOU ❤️! Every single day ..❤️",
    "I love you soo much Sannidhi ❤️"
  ];

  const handleParaComplete = () => {
    if (visibleParagraphs < letterData.length) {
      setVisibleParagraphs(v => v + 1);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto pb-32">
      <p className="text-sm italic ink-whisper mb-16 text-center animate-in fade-in duration-[3000ms]">
        This is the part I would've written by hand.
      </p>
      <div className="text-lg ink-primary font-light leading-loose space-y-10 text-left">
        {letterData.slice(0, visibleParagraphs).map((para, i) => (
          <div key={i} className={i === letterData.length - 1 ? 'pt-10' : ''}>
            <TypewriterText 
              text={para} 
              speed={45}
              className={i === 0 ? 'text-2xl font-normal italic mb-4' : ''}
              onComplete={i === visibleParagraphs - 1 ? handleParaComplete : undefined} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};