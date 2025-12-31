import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LandingPage, ConsentPage, HeartActivityPage, GratitudePage, DragRevealPage, ConfessionPage, AssurancePage, FinalLetterPage } from './components/Pages';

const App: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<number | null>(null);

  const next = useCallback(() => {
    setPageIndex(prev => prev + 1);
  }, []);

  const handleInteraction = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsIdle(false);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIsIdle(true), 4000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleInteraction);
    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [handleInteraction]);

  useEffect(() => {
    const root = document.documentElement;
    // Total pages is now 8 (index 0 to 7)
    const depth = pageIndex / 7;
    const calmness = isIdle ? 0.3 : 1.0;
    
    root.style.setProperty('--depth', depth.toString());
    root.style.setProperty('--calmness', pageIndex === 7 ? '0' : calmness.toString());
  }, [pageIndex, isIdle]);

  const isFinalPage = pageIndex === 7;

  return (
    <div className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Soft cursor glow */}
      {!isFinalPage && (
        <div 
          className="cursor-glow" 
          style={{ 
            left: mousePos.x, 
            top: mousePos.y,
            opacity: isIdle ? 0.2 : 1
          }} 
        />
      )}

      <main 
        className={`relative z-10 w-full max-w-[520px] px-6 text-center transition-all duration-1000 ${isIdle ? 'scale-[0.99] opacity-90' : 'scale-100 opacity-100'}`}
      >
        {pageIndex === 0 && <LandingPage onNext={next} />}
        {pageIndex === 1 && <ConsentPage onNext={next} />}
        {pageIndex === 2 && <HeartActivityPage onNext={next} />}
        {pageIndex === 3 && <GratitudePage onNext={next} />}
        {pageIndex === 4 && <DragRevealPage onNext={next} />}
        {pageIndex === 5 && <ConfessionPage onNext={next} />}
        {pageIndex === 6 && <AssurancePage onNext={next} />}
        {pageIndex === 7 && <FinalLetterPage />}
      </main>
    </div>
  );
};

export default App;