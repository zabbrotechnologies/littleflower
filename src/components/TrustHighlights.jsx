import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Users, UserCheck, Sparkles } from 'lucide-react';

const highlights = [
  {
    icon: Heart,
    title: 'Child-Centered Learning',
    description: "Every lesson is tailored to your child's innate curiosity and natural pace.",
    color: '#E91E63',
    bg: '#FCE4EC',
  },
  {
    icon: Users,
    title: 'Experienced Educators',
    description: 'Empathetic teachers with specialized early-years & Montessori mastery.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: UserCheck,
    title: 'Individual Attention',
    description: 'Intimate student-mentor ratios ensuring every voice is heard and guided.',
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
  {
    icon: Sparkles,
    title: 'Holistic Development',
    description: 'Synthesizing cognitive strength, emotional balance, and creative joy.',
    color: '#E91E63',
    bg: '#FFF1F5',
  },
];

export default function TrustHighlights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="relative z-30 -mt-8 sm:-mt-12 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-[2.2rem] bg-white/95 backdrop-blur-2xl border border-white/95 shadow-[0_20px_50px_-8px_rgba(30,41,59,0.14),0_2px_10px_rgba(0,0,0,0.04)] p-6 sm:p-10 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-slate-200/70">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center px-4"
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xs transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: item.bg }}
                >
                  <Icon className="h-6 w-6" style={{ color: item.color }} strokeWidth={2.2} />
                </div>
                <h3 className="font-headline font-bold text-base text-[#1E293B] mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
