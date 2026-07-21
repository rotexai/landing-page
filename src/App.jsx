import { useEffect, useRef, useState } from 'react';
import './App.css'
import Navbar from "./components/Navbar";
import FloatingLines from './components/FloatingLines';
import useWindowSize from './hooks/useWindowSize';
import TextType from './components/TextType';
import StarBorder from './components/StarBorder';
import ValueProps from './components/ValueProps/ValueProps';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Pricing from './components/Pricing/Pricing';
import WorkflowProof from './components/WorkflowProof/WorkflowProof';
import Contact from './components/Contact/Contact';
import { getCopy } from './i18n';

function App() {
  const storyRef = useRef(null);
  const [language, setLanguage] = useState('en');
  const content = getCopy(language);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.04,
      rootMargin: '0px 0px 18% 0px',
    });

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [language]);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return undefined;

    let frame = 0;
    const clamp = (value) => Math.min(1, Math.max(0, value));

    const updateStory = () => {
      frame = 0;
      const rect = story.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = clamp((0 - rect.top) / viewport);

      story.style.setProperty('--story-progress', progress.toFixed(3));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateStory);
    };

    updateStory();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return (
    <div className="relative w-full bg-white text-zinc-900">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingLines
          lineCount={isMobile ? 4 : 5}
          lineDistance={isMobile ? 10 : 5}
          enabledWaves={isMobile ? ['middle', 'bottom'] : ['top', 'middle', 'bottom']}
          animationSpeed={isMobile ? 0.5 : 1}
          parallax={!isMobile}
        />
      </div>

      <Navbar language={language} onLanguageChange={setLanguage} copy={content.nav} />

      <div ref={storyRef} className="workforce-story relative z-10">
        {/* Hero Section */}
        <div className="story-hero-section h-screen w-full relative overflow-hidden">
          <div className="story-hero-copy absolute z-50 flex w-full flex-col items-center gap-4">
            <h1
              data-reveal
              className="px-4 text-center font-['Be_Vietnam_Pro'] text-4xl font-bold leading-[1.08] tracking-tight text-zinc-950 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="block language-copy" key={`${language}-hero-line1`}>{content.hero.line1}</span>
              <span className="block language-copy text-amber-500" key={`${language}-hero-line2`}>{content.hero.line2}</span>
            </h1>
            <TextType
              key={language}
              text={content.hero.typewriter}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              className="hero-subtitle text-xl md:text-2xl text-zinc-600"
            />
          </div>

          <div id="star-border-btn" className="story-hero-cta absolute z-50">
            <StarBorder
              as="a"
              href="https://portal.rotexai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-class"
              color="magenta"
              speed="5s"
            >
              {content.hero.cta}
            </StarBorder>
          </div>
        </div>


        <ValueProps copy={content.valueProps} />
      </div>
      <HowItWorks copy={content.howItWorks} language={language} />
      <WorkflowProof copy={content.marketplace} />
      <Pricing copy={content.pricing} />
      <Contact copy={content.contact} />
    </div>
  )
}

export default App
