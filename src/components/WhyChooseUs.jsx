import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  UserCheck,
  BookOpen,
  HeartHandshake,
  Brain,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const reasons = [
  {
    icon: UserCheck,
    title: 'Individual Attention',
    description: 'We respect every child’s natural learning curve with personalized teacher guidance.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: BookOpen,
    title: 'Interactive Learning',
    description: 'Hands-on experiential discovery replaces passive memorization with real understanding.',
    color: '#E91E63',
    bg: '#FCE4EC',
  },
  {
    icon: HeartHandshake,
    title: 'Supportive Educators',
    description: 'Passionate, patient teachers who create a warm, secure, and encouraging environment.',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    icon: Brain,
    title: 'Essential Skill Development',
    description: 'Fostering analytical logic, fine motor mastery, language fluency, and creative problem-solving.',
    color: '#1E293B',
    bg: '#F1F5F9',
  },
  {
    icon: Sparkles,
    title: 'Confidence Building',
    description: 'Encouraging independent expression, celebrating milestones, and fostering quiet self-belief.',
    color: '#E91E63',
    bg: '#FFF1F5',
  },
  {
    icon: TrendingUp,
    title: 'Holistic Development',
    description: 'Harmonizing intellect, social empathy, emotional resilience, and lifelong character.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="why-choose-us" className="relative pb-24 md:pb-32 overflow-hidden scroll-mt-12">
      {/* ── GIANT FADED BACKGROUND WATERMARK (Positioned cleanly at top) ── */}
      <div className="absolute top-2 sm:top-4 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-headline font-black text-7xl sm:text-8xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem] uppercase tracking-tighter bg-gradient-to-b from-slate-900/[0.16] via-slate-900/[0.05] to-transparent bg-clip-text text-transparent leading-none whitespace-nowrap">
          WHY US
        </span>
      </div>

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-10 w-[450px] h-[450px] rounded-full bg-[#EFF6FF]/60 blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[420px] h-[420px] rounded-full bg-[#FCE4EC]/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 md:pt-44 lg:pt-48" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E293B] mt-2 mb-4">
            A Nurturing Foundation <span className="text-[#E91E63]">for Life</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            We provide the perfect balance between academic discipline, creative freedom, and
            heartfelt compassion.
          </p>
        </motion.div>

        {/* 2-Column Storytelling Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* LEFT: Authentic Photography Composition with Floating Glass Cards (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#EFF6FF] via-white to-[#FCE4EC]/50 blur-xl pointer-events-none" />

            <div className="relative rounded-[2.2rem] overflow-hidden bg-white/80 backdrop-blur-md border border-white p-2.5 shadow-[0_16px_40px_rgba(30,41,59,0.08)]">
              <div className="relative aspect-[4/5] rounded-[1.8rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80"
                  alt="Educator guiding preschool student with warmth and individual care"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/45 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Glass Pill */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white shadow-xl flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#E91E63] text-white flex items-center justify-center font-headline font-extrabold text-sm shrink-0 shadow-md">
                  1:1
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
                    Personalized Guidance
                  </p>
                  <p className="text-xs text-slate-700 font-semibold">
                    Mentoring suited to your child&apos;s distinctive pace and interests.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: 6 Structured Reason Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-xs hover:shadow-md hover:bg-white transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 shadow-xs"
                      style={{ backgroundColor: r.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: r.color }} strokeWidth={2.2} />
                    </div>
                    <h3 className="font-headline text-base font-bold text-[#1E293B] mb-1.5">
                      {r.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {r.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
