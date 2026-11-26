import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, MessageCircle, Calendar } from 'lucide-react';

export default function AdmissionCTA() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background warm vibrant canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FCE4EC]/50 via-white to-[#EFF6FF]/60 pointer-events-none" />

      {/* Atmospheric glass reflection & subtle patterns */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #E91E63 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E293B] leading-tight"
        >
          Give Your Child a{' '}
          <span className="text-[#E91E63]">Beautiful Beginning.</span>
        </motion.h2>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-700 font-normal leading-relaxed"
        >
          Take the first step towards a joyful learning journey. Connect with our team to
          discover the right learning program for your child.
        </motion.p>

        {/* 3 Buttons: Enquire Now, Book a Visit, WhatsApp Us */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Button 1: Enquire Now */}
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#E91E63] hover:bg-[#D81B60] px-8 py-4 font-bold text-white shadow-[0_12px_32px_rgba(233,30,99,0.3)] border border-white/20 transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer"
          >
            <span>Enquire Now</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          {/* Button 2: Book a Visit */}
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-[#1E293B] px-7 py-4 font-bold backdrop-blur-md border border-slate-200 shadow-md transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-[#2563EB]" />
            <span>Book a Campus Visit</span>
          </a>

          {/* Button 3: WhatsApp Us */}
          <a
            href="https://wa.me/?text=Hello%2C%20I'm%20interested%20in%20Little%20Flowers%20Academy%20admissions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-7 py-4 font-bold text-white shadow-[0_10px_28px_rgba(37,211,102,0.25)] transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer"
          >
            <MessageCircle className="h-4 w-4 fill-white" />
            <span>WhatsApp Us</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
