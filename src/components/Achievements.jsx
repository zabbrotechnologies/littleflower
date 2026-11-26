import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Calculator, Award, BookOpen, CheckCircle } from 'lucide-react';

const achievements = [
  {
    title: 'Student Awards & Honors',
    category: 'Creativity & Character',
    description:
      'Recognizing individual breakthroughs, kindness, and active milestone completion in our early learning cohorts.',
    icon: Trophy,
    className: 'md:col-span-2 md:row-span-2',
    accentBg: 'bg-[#FCE4EC]',
    iconColor: '#E91E63',
    cardBg: 'bg-gradient-to-br from-[#FCE4EC]/40 via-white/90 to-white/80',
    categoryColor: 'text-[#E91E63]',
  },
  {
    title: 'Abacus Competition Poise',
    category: 'Mental Arithmetic',
    description:
      'Celebrating precision, photographic recall, and lightning calculation speeds in mental math tournaments.',
    icon: Calculator,
    className: '',
    accentBg: 'bg-[#EFF6FF]',
    iconColor: '#2563EB',
    cardBg: 'bg-gradient-to-br from-[#EFF6FF]/50 via-white/90 to-white/80',
    categoryColor: 'text-[#2563EB]',
  },
  {
    title: 'Milestone Certificates',
    category: 'Early Years & Foundation',
    description:
      'Commemorating practical life completions, reading milestones, and sensory mastery with joyful recognition.',
    icon: Award,
    className: '',
    accentBg: 'bg-[#FEF3C7]',
    iconColor: '#D97706',
    cardBg: 'bg-gradient-to-br from-[#FEF3C7]/45 via-white/90 to-white/80',
    categoryColor: 'text-[#D97706]',
  },
  {
    title: 'Academic Accomplishments',
    category: 'School Curriculums',
    description:
      'Bridging foundational school excellence in Mathematics, Science, and English with continuous mentor support.',
    icon: BookOpen,
    className: 'md:col-span-2',
    accentBg: 'bg-[#F1F5F9]',
    iconColor: '#1E293B',
    cardBg: 'bg-gradient-to-br from-[#F1F5F9]/60 via-white/90 to-white/80',
    categoryColor: 'text-[#1E293B]',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Achievements() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="achievements" className="relative pb-24 md:pb-32 overflow-hidden scroll-mt-12">
      {/* ── GIANT FADED BACKGROUND WATERMARK (Positioned cleanly at top) ── */}
      <div className="absolute top-2 sm:top-4 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-headline font-black text-7xl sm:text-8xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem] uppercase tracking-tighter bg-gradient-to-b from-slate-900/[0.16] via-slate-900/[0.05] to-transparent bg-clip-text text-transparent leading-none whitespace-nowrap">
          AWARDS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 md:pt-44 lg:pt-48">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E293B] leading-tight">
            Little Achievements, <span className="text-[#E91E63]">Lifelong Triumphs</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Every child’s effort is honored. From regional abacus recognitions to daily confidence
            victories, we celebrate meaningful progress.
          </p>
        </motion.div>

        {/* Bento Grid with Translucent Panels */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {achievements.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative ${item.className} ${item.cardBg} rounded-[2.2rem] p-7 sm:p-8 backdrop-blur-xl border border-white/95 shadow-[0_12px_36px_-6px_rgba(30,41,59,0.06)] hover:shadow-[0_20px_50px_-6px_rgba(30,41,59,0.12)] transition-all duration-400 hover:-translate-y-1.5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl ${item.accentBg} flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.iconColor }} strokeWidth={2.2} />
                    </div>
                    <span className={`text-[11px] font-bold bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white uppercase tracking-wider ${item.categoryColor}`}>
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#1E293B] mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Translucent verified disclosure footnote */}
                <div className="pt-6 mt-6 border-t border-slate-200/50 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB]" />
                  <p className="text-[11px] text-slate-500 font-medium">
                    Verified Little Flowers Academy achievement category
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
