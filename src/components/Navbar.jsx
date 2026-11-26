import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/logo.png';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Programs', href: '#programs' },
  { label: 'Why Us', href: '#why-choose-us' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onAdminClick, isOpen: controlledOpen, setIsOpen: setControlledOpen }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleScroll = useCallback(() => {
    // Show sticky translucent white glassy navbar after scrolling past hero top zone
    setScrolled(window.scrollY > 80);

    const sections = navLinks.map((l) => l.href.replace('#', ''));
    const scrollPos = window.scrollY + 140;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && el.offsetTop <= scrollPos) {
        setActiveSection(sections[i]);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <AnimatePresence>
        {scrolled && (
          <motion.header
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 lg:inset-x-10 z-50 mx-auto max-w-7xl"
          >
            {/* ── Translucent Liquid Glass Pill Container ── */}
            <div className="liquid-glass-nav rounded-2xl sm:rounded-full py-2.5 sm:py-3 px-4 sm:px-6 flex items-center justify-between">
              {/* Brand Logo & Title */}
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, '#home')}
                className="flex items-center gap-2.5 group shrink-0"
                aria-label="Little Flowers Academy"
              >
                <div className="relative flex items-center bg-white p-1 rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-105 border border-slate-100">
                  <img
                    src={logoImg}
                    alt="Little Flowers Academy"
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-headline font-bold text-base sm:text-lg text-[#1E293B] tracking-tight">
                    Little Flowers
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[#E91E63] font-bold -mt-0.5">
                    Academy
                  </span>
                </div>
              </a>

              {/* Desktop Navigation Links */}
              <ul className="hidden lg:flex items-center gap-1.5 xl:gap-2">
                {navLinks.map(({ label, href }) => {
                  const section = href.replace('#', '');
                  const isActive = activeSection === section;
                  return (
                    <li key={href}>
                      <a
                        href={href}
                        onClick={(e) => handleNavClick(e, href)}
                        className={`text-xs xl:text-sm font-semibold tracking-wide transition-all duration-200 px-3.5 py-1.5 rounded-full ${
                          isActive
                            ? 'liquid-glass-pill-active text-[#E91E63] font-bold'
                            : 'text-[#1E293B]/80 hover:text-[#1E293B] hover:bg-white/60'
                        }`}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Right CTA Button & Mobile Toggle */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => onAdminClick && onAdminClick()}
                  className="liquid-glass-btn hidden lg:inline-flex items-center gap-1.5 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Login</span>
                </button>

                {/* Mobile Hamburger Button */}
                <button
                  onClick={() => setIsOpen((v) => !v)}
                  className="lg:hidden p-1.5 text-[#1E293B] hover:opacity-75 transition-opacity cursor-pointer"
                  aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Drawer (Translucent White Glass) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1E293B]/60 backdrop-blur-md lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="absolute right-3 top-3 bottom-3 w-[85%] max-w-sm rounded-3xl liquid-glass-nav p-6 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={logoImg}
                      alt="Logo"
                      className="h-9 w-auto object-contain bg-white rounded-xl p-1 shadow-xs border border-slate-100"
                    />
                    <div className="flex flex-col">
                      <span className="font-headline font-bold text-base text-[#1E293B]">
                        Little Flowers
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#E91E63] font-bold">
                        Academy
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1E293B] transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <ul className="mt-6 space-y-1.5">
                  {navLinks.map(({ label, href }) => {
                    const section = href.replace('#', '');
                    const isActive = activeSection === section;
                    return (
                      <li key={href}>
                        <a
                          href={href}
                          onClick={(e) => handleNavClick(e, href)}
                          className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                            isActive
                              ? 'bg-[#E91E63]/10 text-[#E91E63] font-bold'
                              : 'text-[#1E293B]/80 hover:bg-slate-100 hover:text-[#1E293B]'
                          }`}
                        >
                          <span>{label}</span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#E91E63]" />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (onAdminClick) onAdminClick();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#E91E63]/30 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Login</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
