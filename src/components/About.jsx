import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lightbulb, Palette, Award, Brain, ArrowRight, ShieldCheck } from 'lucide-react';

const corePillars = [
  {
    icon: Lightbulb,
    title: 'Curiosity & Discovery',
    description: 'Empowering children to ask bold questions and discover principles through self-directed investigation.',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    icon: Palette,
    title: 'Creative Expression',
    description: 'Nurturing aesthetic appreciation, original ideas, and sensory creativity in everyday activities.',
    color: '#E91E63',
    bg: '#FCE4EC',
  },
  {
    icon: Award,
    title: 'Independent Confidence',
    description: 'Instilling quiet self-reliance as children master tasks, solve challenges, and take pride in effort.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: Brain,
    title: 'Holistic Intelligence',
    description: 'Developing logical reasoning alongside social empathy, emotional maturity, and motor coordination.',
    color: '#1E293B',
    bg: '#F1F5F9',
  },
];

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative pb-24 md:pb-32 overflow-hidden scroll-mt-12"
    >
      {/* ── GIANT FADED BACKGROUND WATERMARK (Positioned cleanly at top) ── */}
      <div className="absolute top-2 sm:top-4 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-headline font-black text-7xl sm:text-8xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem] uppercase tracking-tighter bg-gradient-to-b from-slate-900/[0.16] via-slate-900/[0.05] to-transparent bg-clip-text text-transparent leading-none whitespace-nowrap">
          ABOUT US
        </span>
      </div>

      {/* Background atmospheric ambient gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-40 w-[450px] h-[450px] rounded-full bg-[#EFF6FF]/70 blur-3xl" />
        <div className="absolute bottom-10 -left-32 w-[400px] h-[400px] rounded-full bg-[#FCE4EC]/60 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 md:pt-44 lg:pt-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* LEFT: Split-Screen Real-World Classroom Photography (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Atmospheric glass backdrop */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#EFF6FF] via-white to-[#FCE4EC]/50 blur-lg -rotate-1 pointer-events-none" />

            <div className="relative rounded-[2.2rem] overflow-hidden bg-white/80 backdrop-blur-md border border-white p-2.5 shadow-[0_16px_40px_rgba(30,41,59,0.08)]">
              <div className="relative aspect-[4/5] rounded-[1.8rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80"
                  alt="Montessori classroom learning environment at Little Flowers Academy"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating glass badge inside image card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FCE4EC] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#E91E63]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                    Caring & Safe Haven
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    A joyful second home dedicated to young hearts and minds.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Storytelling Narrative & Pillars (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            {/* Headline */}
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E293B] leading-[1.18] mb-6">
              Little Steps Today.{' '}
              <span className="text-[#E91E63]">A Brighter Tomorrow.</span>
            </h2>

            {/* Business Storytelling paragraphs */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal mb-5">
              At Little Flowers Academy, education is not a standardized race, but a joyful
              awakening. Inspired by progressive Montessori methodologies, we create carefully
              prepared environments where children explore at their own natural pace.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-8">
              We champion child-centered teaching, honoring each student&apos;s unique interests.
              Through gentle individualized mentorship and interactive learning materials, our
              students build resilience, intellectual curiosity, and self-confidence.
            </p>

            {/* 4 Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {corePillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-4.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: pillar.bg }}
                      >
                        <Icon className="w-5 h-5" style={{ color: pillar.color }} strokeWidth={2.2} />
                      </div>
                      <div>
                        <h3 className="font-headline text-sm sm:text-base font-bold text-[#1E293B] mb-1">
                          {pillar.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discover Our Approach CTA */}
            <div className="flex items-center gap-4">
              <a
                href="#philosophy"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#E91E63] hover:bg-[#D81B60] text-white px-7 py-3.5 text-sm font-bold shadow-[0_8px_24px_rgba(233,30,99,0.25)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Discover Our Approach</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-[#1E293B] px-6 py-3.5 text-sm font-bold border border-slate-200 shadow-xs transition-all duration-300"
              >
                <span>Visit Campus</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
