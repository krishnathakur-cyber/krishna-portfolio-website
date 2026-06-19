import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Certifications from './components/Certifications';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Background3D from './components/Background3D';
import CyberEffects from './components/CyberEffects';

// Analytics tracking assets
import { initializeTracker, trackPageTransition } from './utils/tracker';
import ExitIntentFeedback from './components/ExitIntentFeedback';
import AdminDashboard from './components/AdminDashboard';

function MainAppContent() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize analytics session on initial browser paint
  useEffect(() => {
    initializeTracker('hero');
  }, []);

  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'timeline', 'certs', 'blog', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250; // offset threshold for sticky navbar
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (activeSection !== sectionId) {
              setActiveSection(sectionId);
              trackPageTransition(sectionId);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div className="relative min-h-screen bg-[#060810] text-gray-100 dark:bg-[#060810] transition-colors duration-300 font-sans antialiased overflow-x-hidden selection:bg-violet-600 selection:text-white">
      {/* 3D Moving Perspective Background Layer */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <Background3D />
      </div>

      {/* Front Page Layout Modules */}
      <div className="relative z-10 w-full">
        <Navbar activeSection={activeSection} />
        <main id="portfolio-scroll-container">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Timeline />
          <Certifications />
          <Testimonials />
          <Blog />
          <Contact />
        </main>
        <Footer onAdminClick={() => setIsAdminOpen(true)} />
      </div>

      {/* Telemetry Exit intention detector overlay */}
      <ExitIntentFeedback />

      {/* Cyberpunk Hacker Interactive Environmental overlay and floating toggle wheel */}
      <CyberEffects />

      {/* Secure admin controller dashboard overlay */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}

