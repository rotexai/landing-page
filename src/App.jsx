import './App.css'
import Navbar from "./components/Navbar";
import FloatingLines from './components/FloatingLines';
import useWindowSize from './hooks/useWindowSize';
import SplitText from './components/SplitText';
import TextType from './components/TextType';
import StarBorder from './components/StarBorder';
import ValueProps from './components/ValueProps/ValueProps';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Differentiators from './components/Differentiators/Differentiators';
import Pricing from './components/Pricing/Pricing';
import Contact from './components/Contact/Contact';

function App() {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

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

      <Navbar />

      {/* Hero Section */}
      <div className="h-screen w-full relative overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 w-full">
          <SplitText
            text="Understand Your Website"
            className="text-4xl md:text-6xl font-bold text-center font-['Poppins']"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <TextType
            text={[
              "Validate the logic behind the app.",
              "Debug workflows instead of guessing.",
              "AI for creation. Workflows for control.",
              "Manage every workflow in its own workspace."
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            className="text-xl md:text-2xl text-zinc-600"
          />
        </div>

        <div id="star-border-btn" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
          <StarBorder
            as="a"
            href="https://portal.rotexai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="custom-class"
            color="magenta"
            speed="5s"
          >
            Try RotexAI
          </StarBorder>
        </div>
      </div>


      <ValueProps />
      <HowItWorks />
      <Differentiators />
      <Pricing />
      <Contact />
    </div>
  )
}

export default App
