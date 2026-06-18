import { useRef, useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/sections/Hero';
import SelectedWork from './components/sections/SelectedWork';
import AboutStack from './components/sections/AboutStack';
import Contact from './components/sections/Contact';
import FilmGrain from './components/effects/FilmGrain';
import CustomCursor from './components/effects/CustomCursor';
import BootSequence from './components/effects/BootSequence';
import ScrollProgress from './components/effects/ScrollProgress';
import { useReducedMotion } from './hooks/useReducedMotion';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bootComplete, setBootComplete] = useState(false);
  const reducedMotion = useReducedMotion();

  // Grid parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty('--grid-offset', `${scrollY * 0.1}px`);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If reduced motion, skip boot sequence immediately
  const handleBootComplete = () => setBootComplete(true);

  // Auto-complete boot if reduced motion
  useEffect(() => {
    if (reducedMotion) {
      setBootComplete(true);
    }
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#000000] text-[#FFFFFF] font-mono antialiased">
      {/* Boot sequence gates all content */}
      {!bootComplete && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      {/* Main content — hidden during boot */}
      {bootComplete && (
        <>
          <CustomCursor />
          <ScrollProgress />
          <FilmGrain />
          <Nav />
          <main>
            <Hero />
            <SelectedWork />
            <AboutStack />
            <Contact />
          </main>
        </>
      )}
    </div>
  );
}
