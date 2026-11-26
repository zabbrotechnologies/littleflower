import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const pathways = [
  {
    id: 0,
    title: 'Montessori Learning',
    badge: 'Ages 2.5 – 6 Years',
    badgeBg: 'bg-[#FCE4EC] text-[#E91E63]',
    accentColor: '#E91E63',
    subtitle: 'Child-Led Sensory & Practical Foundation',
    description:
      'An authentic, internationally inspired early childhood methodology where children learn through sensorial touch, tactile discovery, practical life skills, and natural curiosity in carefully prepared environments.',
    benefits: [
      'Tactile sensorial & fine motor skill mastery',
      'Early phonetic literacy & concrete mathematical concepts',
      'Freedom of choice within structured, prepared environments',
      'Development of concentration, order, and peaceful social grace',
    ],
    image:
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 1,
    title: 'Abacus Mental Arithmetic',
    badge: 'Ages 5 – 12 Years',
    badgeBg: 'bg-[#EFF6FF] text-[#2563EB]',
    accentColor: '#2563EB',
    subtitle: 'Bilateral Brain & Speed Calculation',
    description:
      'A structured brain-development and mental arithmetic program that stimulates both left and right hemispheres through visualization of the Soroban abacus bead framework.',
    benefits: [
      'Rapid mental arithmetic and lightning calculation speed',
      'Dramatic enhancement of visual memory and focus endurance',
      'Elimination of mathematics hesitation and exam anxiety',
      'Heightened spatial cognitive ability and logical agility',
    ],
    image:
      'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Academic Tuition',
    badge: 'Grades 1 – 8 Support',
    badgeBg: 'bg-[#FEF3C7] text-[#D97706]',
    accentColor: '#F59E0B',
    subtitle: 'Concept-First School Coaching & Support',
    description:
      'Personalized grade-wise academic coaching bridging foundational concepts in Mathematics, Science, and English, guided by supportive mentors in small, attentive cohort groups.',
    benefits: [
      'Concept-first methodology avoiding mechanical rote memorization',
      'Individualized doubt-clearing and personalized attention',
      'Structured study habits, exam readiness, and revision drills',
      'Continuous progress feedback to parents with compassionate mentorship',
    ],
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Early Phonics & Language',
    badge: 'Ages 3 – 7 Years',
    badgeBg: 'bg-[#FCE4EC] text-[#E91E63]',
    accentColor: '#E91E63',
    subtitle: 'Interactive Speech & Reading Readiness',
    description:
      'Nurturing expressive communication, vocabulary richness, early phonetic decoding, and a lifelong love for reading through multisensory storytelling and language games.',
    benefits: [
      'Systematic phonetic sound recognition & blending mastery',
      'Expressive verbal communication & classroom confidence',
      'Vocabulary enrichment through guided pictorial storytelling',
      'Attentive listening habits and social conversation etiquette',
    ],
    image:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Creative Arts & Motor Skills',
    badge: 'Ages 2.5 – 8 Years',
    badgeBg: 'bg-[#F1F5F9] text-[#1E293B]',
    accentColor: '#1E293B',
    subtitle: 'Imagination, Color & Tactile Dexterity',
    description:
      'Inspiring boundless creative expression through open-ended painting, tactile clay modeling, rhythmic music, and sensory crafts that sharpen hand-eye coordination.',
    benefits: [
      'Refined pincer grasp, bilateral hand coordination, and dexterity',
      'Emotional expression and non-verbal creative articulation',
      'Spatial-visual reasoning through three-dimensional materials',
      'Joyful appreciation of color harmony and individual artistic voice',
    ],
    image:
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function Programs() {
  const [activeIndex, setActiveIndex] = useState(2); // Center card active by default
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = pathways.length;

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Responsive step offset calculation to fill available screen space
  const getStepOffset = () => {
    if (windowWidth < 480) return 70;
    if (windowWidth < 640) return 95;
    if (windowWidth < 768) return 150;
    if (windowWidth < 1024) return 210;
    if (windowWidth < 1280) return 270;
    return 320;
  };

  const activePathway = pathways[activeIndex];
  const stepOffset = getStepOffset();

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="relative pb-24 md:pb-32 overflow-hidden scroll-mt-12 bg-gradient-to-b from-white/40 via-white/80 to-white/40"
    >
      {/* ── GIANT FADED BACKGROUND WATERMARK (Positioned cleanly at top) ── */}
      <div className="absolute top-2 sm:top-4 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-headline font-black text-7xl sm:text-8xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem] uppercase tracking-tighter bg-gradient-to-b from-slate-900/[0.16] via-slate-900/[0.05] to-transparent bg-clip-text text-transparent leading-none whitespace-nowrap">
          PATHWAYS
        </span>
      </div>

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#EFF6FF]/60 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#FCE4EC]/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 md:pt-44 lg:pt-48">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E293B] mt-2 mb-4 leading-tight">
            Curated Programs for <span className="text-[#E91E63]">Every Milestone</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Explore our specialized developmental pathways—from early Montessori sensory foundations to abacus mental arithmetic and concept tuition.
          </p>
        </motion.div>

        {/* ── 3D COVERFLOW FANNED CARD DECK (Significantly Enlarged & Space-Filling) ── */}
        <div className="relative w-full mx-auto pt-2 pb-6 sm:pb-10">
          {/* Navigation arrow buttons */}
          <button
            onClick={goPrev}
            className="absolute left-1 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex items-center justify-center text-[#1E293B] hover:bg-[#E91E63] hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Previous pathway"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-1 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex items-center justify-center text-[#1E293B] hover:bg-[#E91E63] hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Next pathway"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Cards Deck Stage Container */}
          <div className="relative h-[440px] sm:h-[530px] md:h-[600px] lg:h-[650px] flex items-center justify-center overflow-hidden">
            {pathways.map((item, index) => {
              // Calculate relative distance from the activeIndex (-2, -1, 0, 1, 2)
              let offset = index - activeIndex;
              if (offset > 2) offset -= total;
              if (offset < -2) offset += total;

              const isCenter = offset === 0;
              const isImmediate = Math.abs(offset) === 1;
              const isOuter = Math.abs(offset) === 2;

              // Horizontal translation dynamically filling the screen width
              const translateX = offset * stepOffset;
              // Scale: Center is 1.05, Immediate is 0.88, Outer is 0.74
              const scale = isCenter ? 1.05 : isImmediate ? 0.88 : 0.74;
              // Z-Index: Center is 30, Immediate is 20, Outer is 10
              const zIndex = isCenter ? 30 : isImmediate ? 20 : 10;
              // Opacity: Center is 1.0, Immediate is 0.85, Outer is 0.45
              const opacity = isCenter ? 1 : isImmediate ? 0.85 : 0.45;
              // Grayscale filter for flanking cards matching the reference image!
              const grayscale = isCenter
                ? 'grayscale(0%)'
                : isImmediate
                ? 'grayscale(60%) contrast(95%)'
                : 'grayscale(100%) opacity(40%)';

              return (
                <motion.div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  initial={false}
                  animate={{
                    x: translateX,
                    scale: scale,
                    zIndex: zIndex,
                    opacity: opacity,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 28,
                  }}
                  style={{
                    filter: grayscale,
                  }}
                  className={`absolute w-[240px] sm:w-[310px] md:w-[380px] lg:w-[440px] xl:w-[460px] h-[370px] sm:h-[470px] md:h-[540px] lg:h-[590px] rounded-[2.2rem] sm:rounded-[2.8rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 ${
                    isCenter
                      ? 'shadow-[0_30px_70px_-15px_rgba(0,0,0,0.38)] ring-4 ring-white'
                      : 'shadow-lg hover:opacity-95'
                  }`}
                >
                  {/* Card Background Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                  {/* Card Header Tag */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full backdrop-blur-md shadow-md border border-white/60 ${item.badgeBg}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Card Bottom Title & Subtitle */}
                  <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-7 right-5 sm:right-7 text-left">
                    <h3 className="font-headline font-bold text-lg sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-white/85 font-medium line-clamp-1 mt-1">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── PAGINATION DOTS (Exact match: o o ● o o from reference image) ── */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6">
            {pathways.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === i
                    ? 'w-4 h-4 bg-[#1E293B] shadow-md scale-110 ring-2 ring-[#1E293B]/20'
                    : 'w-3 h-3 bg-transparent border-2 border-slate-400 hover:border-slate-800'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── ACTIVE PATHWAY DETAILED GLASS PANEL (Presented cleanly below fanned cards) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePathway.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto rounded-[2.5rem] bg-white/95 backdrop-blur-2xl border border-white p-7 sm:p-12 shadow-[0_20px_50px_rgba(30,41,59,0.08)] mt-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Narrative description (7 cols) */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide ${activePathway.badgeBg}`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{activePathway.badge}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Pathway 0{activePathway.id + 1}
                  </span>
                </div>

                <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E293B] mb-3">
                  {activePathway.title}
                </h3>

                <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal mb-6">
                  {activePathway.description}
                </p>

                {/* Key Benefits Grid */}
                <div className="space-y-2.5 mb-6">
                  {activePathway.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2.5 text-xs sm:text-sm md:text-base text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#E91E63] shrink-0 mt-1" />
                      <span className="font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Admission CTA Box (5 cols) */}
              <div className="lg:col-span-5 p-7 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#E91E63]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Admissions Open
                    </span>
                  </div>
                  <h4 className="font-headline font-bold text-xl text-[#1E293B] mb-2">
                    Reserve a Seat for {activePathway.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                    Our batches maintain intimate teacher-student ratios for optimal individual attention.
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#E91E63]/25 transition-all hover:-translate-y-0.5"
                  >
                    <span>Enquire for Admission</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-white hover:bg-slate-100 text-[#1E293B] font-semibold text-xs sm:text-sm rounded-2xl border border-slate-200 transition-colors"
                  >
                    <span>Book a Campus Visit</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
