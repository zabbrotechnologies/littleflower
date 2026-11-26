import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote:
      'Enrolling our daughter in Little Flowers Academy has been the most fulfilling decision. The Montessori environment has instilled such genuine curiosity, self-discipline, and joy in her daily routine.',
    author: 'Parent of Preschool Student',
    role: 'Montessori Toddler Cohort',
    initials: 'RS',
    accentBg: '#FCE4EC',
    textColor: '#E91E63',
  },
  {
    id: 2,
    quote:
      'The abacus training program transformed how my son perceives numbers. His mental computation speed and sustained focus during school study hours have improved remarkably.',
    author: 'Parent of Primary Student',
    role: 'Abacus Junior Batch',
    initials: 'AK',
    accentBg: '#EFF6FF',
    textColor: '#2563EB',
  },
  {
    id: 3,
    quote:
      'What stands out most is the compassionate personal care. The teachers truly observe each child as an individual. It feels like a safe, uplifting community where children are cherished.',
    author: 'Parent of Kindergarten Student',
    role: 'Foundation Cohort',
    initials: 'PM',
    accentBg: '#FEF3C7',
    textColor: '#D97706',
  },
  {
    id: 4,
    quote:
      'The academic tuition mentors clarify difficult concepts with immense patience. My daughter no longer hesitates before asking questions, and her exam confidence has soared.',
    author: 'Parent of Middle Schooler',
    role: 'Academic Tuition Program',
    initials: 'SJ',
    accentBg: '#F1F5F9',
    textColor: '#1E293B',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const getVisibleCount = useCallback(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }, []);

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getVisibleCount]);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    const interval = setInterval(goNext, 6500);
    return () => clearInterval(interval);
  }, [goNext]);

  return (
    <section className="relative pb-24 md:pb-32 overflow-hidden scroll-mt-12">
      {/* ── GIANT FADED BACKGROUND WATERMARK (Positioned cleanly at top) ── */}
      <div className="absolute top-2 sm:top-4 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-headline font-black text-7xl sm:text-8xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem] uppercase tracking-tighter bg-gradient-to-b from-slate-900/[0.16] via-slate-900/[0.05] to-transparent bg-clip-text text-transparent leading-none whitespace-nowrap">
          REVIEWS
        </span>
      </div>

      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#EFF6FF]/60 blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] rounded-full bg-[#FCE4EC]/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 md:pt-44 lg:pt-48" ref={sectionRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E293B] leading-tight">
            Happy Children. <span className="text-[#E91E63]">Confident Parents.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Heartfelt reflections from families who trust Little Flowers Academy with their
            children&apos;s crucial developmental years.
          </p>
        </motion.div>

        {/* Carousel of Large Translucent Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.slice(currentIndex, currentIndex + visibleCount).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-[2.2rem] bg-white/85 backdrop-blur-xl border border-white/95 shadow-[0_14px_40px_-6px_rgba(30,41,59,0.06)] hover:shadow-[0_20px_50px_-6px_rgba(30,41,59,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#E91E63] shadow-xs">
                    <Quote className="w-5 h-5 fill-[#E91E63]/20" />
                  </div>
                  <span className="text-[11px] font-bold text-[#E91E63] bg-[#FCE4EC] px-3 py-1 rounded-full border border-[#E91E63]/20">
                    Verified Parent
                  </span>
                </div>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal mb-8 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-5 border-t border-slate-100">
                <div
                  className="w-11 h-11 rounded-2xl font-headline font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0"
                  style={{ backgroundColor: item.accentBg, color: item.textColor }}
                >
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-headline text-sm font-bold text-[#1E293B]">
                    {item.author}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={goPrev}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-white shadow-xs flex items-center justify-center text-[#1E293B] hover:bg-[#E91E63] hover:text-white transition-all cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === i ? 'w-8 bg-[#E91E63]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-white shadow-xs flex items-center justify-center text-[#1E293B] hover:bg-[#E91E63] hover:text-white transition-all cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
