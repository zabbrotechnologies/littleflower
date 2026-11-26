import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck, Menu } from 'lucide-react';
import heroBg from '../assets/hero-bg.jpg';
import logoImg from '../assets/logo.png';

export default function Hero({ onAdminClick, onMenuClick }) {
  const heroRef = useRef(null);

  // ── Parallax Scroll Effect for Hero Background ──
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#1E293B]"
    >
      {/* ── Parallax Background Image Container ── */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute -top-[10%] inset-x-0 h-[125%] z-0 pointer-events-none will-change-transform"
      >
        <img
          src={heroBg}
          alt="Little Flowers Academy - Joyful, World-Class Early Learning"
          className="w-full h-full object-cover object-center"
        />

        {/* ── Cinematic Ambient Gradients for Crisp Readability ── */}
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />

        {/* Bottom deep gradient for headline and buttons */}
        <div className="absolute inset-x-0 bottom-0 h-[78%] sm:h-[68%] bg-gradient-to-t from-[#0F172A]/95 via-black/55 to-transparent" />

        {/* Subtle overall dark film */}
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* ── Top Floating Translucent Liquid Glassy Navbar ── */}
      <header className="relative z-20 w-full pt-4 sm:pt-6 px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl liquid-glass-nav-hero rounded-2xl sm:rounded-full py-2.5 sm:py-3 px-5 sm:px-7 flex items-center justify-between">
          {/* Left: Brand Logo & Title */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#home');
            }}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
          >
            <div className="relative flex items-center bg-white p-1 rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-105 border border-white/60">
              <img
                src={logoImg}
                alt="Little Flowers Academy"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-headline font-bold text-base sm:text-lg text-white tracking-tight drop-shadow-xs">
                Little Flowers
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#F59E0B] font-bold -mt-0.5">
                Academy
              </span>
            </div>
          </a>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#home');
              }}
              className="text-white hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/20 transition-all font-semibold"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#about');
              }}
              className="text-white/85 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/20 transition-all font-semibold"
            >
              About
            </a>
            <a
              href="#philosophy"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#philosophy');
              }}
              className="text-white/85 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/20 transition-all font-semibold"
            >
              Philosophy
            </a>
            <a
              href="#programs"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#programs');
              }}
              className="text-white/85 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/20 transition-all font-semibold"
            >
              Programs
            </a>
            <a
              href="#why-choose-us"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#why-choose-us');
              }}
              className="text-white/85 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/20 transition-all font-semibold"
            >
              Why Us
            </a>
            <a
              href="#achievements"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#achievements');
              }}
              className="text-white/85 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/20 transition-all font-semibold"
            >
              Achievements
            </a>
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#gallery');
              }}
              className="text-white/85 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/20 transition-all font-semibold"
            >
              Gallery
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#contact');
              }}
              className="text-white/85 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/20 transition-all font-semibold"
            >
              Contact
            </a>
          </nav>

          {/* Right: Admin Login Glassy Button (Desktop) & Mobile Drawer Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAdminClick && onAdminClick()}
              className="liquid-glass-btn hidden lg:inline-flex items-center gap-1.5 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
            <button
              type="button"
              onClick={() => onMenuClick && onMenuClick()}
              className="lg:hidden p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for middle view of the image */}
      <div className="flex-1 min-h-[140px]" />

      {/* ── Main Hero Content Overlay (Bottom-aligned with subtle parallax) ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pb-16 sm:pb-24 lg:pb-28 will-change-transform"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* ── LEFT SIDE: Main Headline, Subtitle & Dual Buttons (8 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 max-w-2xl"
          >
            {/* Primary Headline */}
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold text-white tracking-tight leading-[1.12]">
              Elevate your child&apos;s future with world-class creative education.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-sm sm:text-base md:text-lg text-white/90 font-normal leading-relaxed max-w-xl">
              Join Little Flowers Academy to discover child-centered Montessori learning,
              abacus arithmetic, and personalized academic tutoring from compassionate educators.
              Build a foundation that demands confidence.
            </p>

            {/* Dual CTA Buttons (Matching Brand Palette) */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* Button 1: Primary Brand Pink / Magenta #E91E63 */}
              <a
                href="#programs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#programs');
                }}
                className="group inline-flex items-center gap-2 bg-[#E91E63] hover:bg-[#D81B60] text-white text-sm sm:text-base font-bold px-7 py-3.5 rounded-2xl shadow-xl shadow-[#E91E63]/40 border border-white/25 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Programs</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              {/* Button 2: Translucent White Glass Button */}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#contact');
                }}
                className="inline-flex items-center bg-white/90 hover:bg-white text-[#1E293B] text-sm sm:text-base font-bold px-7 py-3.5 rounded-2xl shadow-xl shadow-black/20 border border-white/70 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
              >
                <span>Enquire for Admission</span>
              </a>
            </div>
          </motion.div>

          {/* ── RIGHT SIDE: "Global Platform" Callout (4 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 lg:text-left flex flex-col justify-end"
          >
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse" />
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Global Platform
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
                Curated curriculum designed to push creative boundaries, nurture self-confidence,
                and inspire joyful learning. every. single. time.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
