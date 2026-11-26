import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Glass Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-[#1E293B] shadow-lg border border-white"
              >
                Chat with Admissions
              </motion.span>
            )}
          </AnimatePresence>

          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping" />

          {/* Button */}
          <a
            href="https://wa.me/?text=Hello%2C%20I'm%20interested%20in%20Little%20Flowers%20Academy%20admissions"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Little Flowers Academy on WhatsApp"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.35)] border-2 border-white transition-all duration-300 hover:scale-108 hover:bg-[#20ba59] cursor-pointer"
          >
            <MessageCircle className="h-6 w-6 fill-white" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
