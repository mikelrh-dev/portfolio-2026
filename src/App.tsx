import { useRef, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/sections/Hero';
import SelectedWork from './components/sections/SelectedWork';
import AboutStack from './components/sections/AboutStack';
import Contact from './components/sections/Contact';
import FilmGrain from './components/effects/FilmGrain';
import ScrollProgress from './components/effects/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import SharedScrollSequence from './components/effects/SharedScrollSequence';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Grid parallax effect — disabled on mobile (<768px) to prevent full
  // viewport repaints per scroll event on low-end devices.
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) return;
      const scrollY = window.scrollY;
      document.documentElement.style.setProperty('--grid-offset', `${scrollY * 0.1}px`);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ErrorBoundary>
      <div ref={containerRef} className="relative min-h-screen bg-[#000000] text-[#FFFFFF] antialiased">
        <ScrollProgress />
        <FilmGrain />
        <Nav />
        <main>
          <SharedScrollSequence>
            <Hero />
            <AboutStack />
          </SharedScrollSequence>
          <SelectedWork />
          <Contact />
        </main>
      </div>
    </ErrorBoundary>
  );
}
