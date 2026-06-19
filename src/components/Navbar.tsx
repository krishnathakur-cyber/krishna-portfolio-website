import { useState, useEffect, MouseEvent } from 'react';
import { useTheme } from './ThemeContext';
import { Shield, Sun, Moon, Menu, X, Terminal } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Certifications', href: '#certs' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Offset for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0F19]/80 dark:bg-[#0B0F19]/80 backdrop-blur-md py-4 border-b border-gray-200/10 dark:border-gray-800/20 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2 group focus:outline-none"
            id="logo-link"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-violet-600 text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5" />
              <div className="absolute inset-0 rounded-lg bg-violet-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none text-slate-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-cyan-400 transition-colors duration-200">
                KRISHNA
              </span>
              <span className="font-mono text-[10px] tracking-widest text-violet-600 dark:text-cyan-400 font-semibold leading-none mt-1">
                SEC_DEV
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-850">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-desktop"
              aria-label="Toggle Theme"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-gray-300 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none group hover:scale-105"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-violet-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              id="theme-toggle-mobile"
              aria-label="Toggle Theme"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-gray-300"
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="hamburger-menu"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-205">
          <div className="px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg font-sans text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-900/80'
                  }`}
                >
                  <span>{item.label}</span>
                  <Terminal className="w-4 h-4 opacity-50" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
