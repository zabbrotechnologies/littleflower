import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Compass, Palette, Lightbulb, Sprout, ArrowRight } from 'lucide-react';

const principles = [
  {
    step: '01',
    title: 'Explore',
    subtitle: 'Encourage curiosity and discovery',
    description:
      'Children learn best when propelled by natural wonder. We create stimulating environments filled with tactile Montessori materials that invite hands-on exploration.',
    icon: Compass,
    accent: '#2563EB',
    bg: '#EFF6FF',
    borderGradient: 'hover:border-[#2563EB]/40',
  },
  {
    step: '02',
    title: 'Create',
    subtitle: 'Develop imagination and creative thinking',
    description:
      'Artistic expression, storytelling, and open-ended play empower children to innovate, voice their emotions, and construct original ideas without fear of mistakes.',
    icon: Palette,
    accent: '#E91E63',
    bg: '#FCE4EC',
    borderGradient: 'hover:border-[#E91E63]/40',
  },
  {
    step: '03',
    title: 'Understand',
    subtitle: 'Build strong foundational concepts',
    description:
      'From sensorial mathematics to early literacy and abacus mental arithmetic, we ground abstract knowledge in concrete, intuitive real-world understanding.',
    icon: Lightbulb,
    accent: '#D97706',
    bg: '#FEF3C7',
    borderGradient: 'hover:border-[#F59E0B]/50',
  },
  {
    step: '04',
    title: 'Grow',
    subtitle: 'Develop confidence and independence',
    description:
      'Through purposeful self-direction and gentle guidance, students master practical life skills, social empathy, and the self-confidence to excel anywhere.',
    icon: Sprout,
    accent: '#1E293B',
    bg: '#F1F5F9',
    borderGradient: 'hover:border-[#1E293B]/40',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function LearningPhilosophy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="philosophy" className="relative pb-24 md:pb-32 overflow-hidden scroll-mt-16">
      {/* ── GIANT FADED BACKGROUND WATERMARK (Positioned cleanly at top) ── */}
      <div className="absolute top-2 sm:top-4 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-headline font-black text-7xl sm:text-8xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem] uppercase tracking-tighter bg-gradient-to-b from-slate-900/[0.16] via-slate-900/[0.05] to-transparent bg-clip-text text-transparent leading-none whitespace-nowrap">
          PHILOSOPHY
        </span>
      </div>

      {/* Background atmospheric glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#EFF6FF]/70 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-[#FCE4EC]/60 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 md:pt-44 lg:pt-48" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E293B] leading-tight">
            Every Child Learns Differently.{' '}
            <span className="text-[#E91E63]">Every Child Deserves to Shine.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Our holistic framework integrates Maria Montessori principles with modern cognitive
            development, walking alongside children as they blossom step by step.
          </p>
        </motion.div>

        {/* 4 Floating Translucent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className={`group relative rounded-3xl p-7 bg-white/80 backdrop-blur-md border border-white shadow-[0_12px_36px_-6px_rgba(30,41,59,0.06)] transition-all duration-300 hover:shadow-[0_20px_45px_-6px_rgba(30,41,59,0.12)] hover:-translate-y-2 flex flex-col justify-between ${p.borderGradient}`}
              >
                <div className="relative z-10">
                  {/* Top Bar: Icon & Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-13 h-13 rounded-2xl flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: p.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: p.accent }} strokeWidth={2.2} />
                    </div>
                    <span className="font-headline text-xl font-extrabold text-slate-300 group-hover:text-slate-500 transition-colors">
                      {p.step}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-headline text-2xl font-bold text-[#1E293B] mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: p.accent }}>
                    {p.subtitle}
                  </p>

                  {/* Body description */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>

                {/* Bottom link */}
                <div className="relative z-10 pt-6 mt-6 border-t border-slate-100">
                  <a
                    href="#programs"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E293B] group-hover:text-[#E91E63] group-hover:gap-2.5 transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
