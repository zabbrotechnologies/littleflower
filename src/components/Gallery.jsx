import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Eye, X } from 'lucide-react';

const categories = [
  'All',
  'Classroom Activities',
  'Montessori Learning',
  'Abacus Practice',
  'Creative Activities',
  'Events and Celebrations',
  'Student Achievements',
];

const galleryItems = [
  {
    id: 1,
    category: 'Montessori Learning',
    title: 'Sensorial Cylinder Blocks & Spatial Geometry',
    caption: 'Children develop dimensional reasoning through hands-on wooden apparatus.',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
    height: 'h-80 sm:h-96',
  },
  {
    id: 2,
    category: 'Classroom Activities',
    title: 'Practical Life: Caring for Plants & Environment',
    caption: 'Fostering ecological mindfulness and motor coordination from an early age.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    height: 'h-64 sm:h-72',
  },
  {
    id: 3,
    category: 'Abacus Practice',
    title: 'Mental Arithmetic & Soroban Visualization',
    caption: 'Focus, precision, and lightning addition drills in progressive rounds.',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
    height: 'h-64 sm:h-72',
  },
  {
    id: 4,
    category: 'Creative Activities',
    title: 'Finger Painting & Sensorial Color Expression',
    caption: 'Encouraging boundless creativity and emotional freedom through open-ended art.',
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
    height: 'h-72 sm:h-80',
  },
  {
    id: 5,
    category: 'Events and Celebrations',
    title: 'Annual Day Festival & Cultural Performance',
    caption: 'Children joyfully showcasing theatrical story plays, songs, and communal warmth.',
    image: 'https://images.unsplash.com/photo-1511949860663-92c5c57d48a7?auto=format&fit=crop&w=800&q=80',
    height: 'h-64 sm:h-72',
  },
  {
    id: 6,
    category: 'Student Achievements',
    title: 'Abacus Math Master Milestone Certificate',
    caption: 'Celebrating perseverance and mathematical poise after stage evaluation.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    height: 'h-72 sm:h-80',
  },
  {
    id: 7,
    category: 'Classroom Activities',
    title: 'Story Circles & Interactive Language Reading',
    caption: 'Daily book discovery inspiring vocabulary, empathy, and listening skills.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    height: 'h-64 sm:h-72',
  },
  {
    id: 8,
    category: 'Montessori Learning',
    title: 'Independent Tactile Math Beads',
    caption: 'Translating quantity into numbers using Montessori golden bead materials.',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    height: 'h-64 sm:h-72',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="relative pb-24 md:pb-32 overflow-hidden scroll-mt-12">
      {/* ── GIANT FADED BACKGROUND WATERMARK (Positioned cleanly at top) ── */}
      <div className="absolute top-2 sm:top-4 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-headline font-black text-7xl sm:text-8xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem] uppercase tracking-tighter bg-gradient-to-b from-slate-900/[0.16] via-slate-900/[0.05] to-transparent bg-clip-text text-transparent leading-none whitespace-nowrap">
          GALLERY
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 md:pt-44 lg:pt-48">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E293B] leading-tight">
            Everyday Wonder in <span className="text-[#E91E63]">Action</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Witness the joy of discovery, creative expression, and milestone accomplishments that
            fill our vibrant campus daily.
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-14"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer shadow-xs ${
                activeCategory === cat
                  ? 'bg-[#E91E63] text-white shadow-md shadow-[#E91E63]/30 scale-105'
                  : 'bg-white/80 backdrop-blur-md text-[#1E293B] border border-white/90 hover:bg-white hover:text-[#E91E63]'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry Layout with Glass Overlays */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                className={`group relative ${item.height} rounded-[2rem] overflow-hidden cursor-pointer
                  break-inside-avoid border border-white/80 shadow-[0_12px_36px_rgba(30,41,59,0.06)] hover:shadow-[0_20px_48px_rgba(30,41,59,0.12)] transition-all duration-500`}
                onClick={() => setLightboxItem(item)}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Floating Category Pill */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#E91E63] border border-white shadow-xs">
                    {item.category}
                  </span>
                </div>

                {/* Glass Overlay Caption at Bottom */}
                <div className="absolute inset-x-3 bottom-3 p-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="font-headline text-sm sm:text-base font-bold text-[#1E293B] line-clamp-1 mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-normal line-clamp-2">
                    {item.caption}
                  </p>
                </div>

                {/* Hover Eye Icon Trigger */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-white shadow-sm flex items-center justify-center text-[#E91E63] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0F172A]/85 backdrop-blur-lg z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setLightboxItem(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close image modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content Panel */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-3xl rounded-[2.2rem] overflow-hidden bg-white/95 backdrop-blur-2xl border border-white shadow-2xl p-3 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] rounded-[1.8rem] overflow-hidden mb-4">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E91E63] bg-[#FCE4EC] px-3 py-1 rounded-full">
                    {lightboxItem.category}
                  </span>
                </div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#1E293B] mb-2">
                  {lightboxItem.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {lightboxItem.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
