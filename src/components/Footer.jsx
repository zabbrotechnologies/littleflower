import { MessageCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Programs', href: '#programs' },
  { label: 'Why Choose Us', href: '#why-choose-us' },
  { label: 'Student Achievements', href: '#achievements' },
  { label: 'Campus Gallery', href: '#gallery' },
  { label: 'Contact & Admissions', href: '#contact' },
];

const programs = [
  'Montessori Learning (Ages 2.5 – 6)',
  'Abacus Mental Arithmetic (Ages 5 – 12)',
  'Academic Tuition (Grades 1 – 8)',
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white overflow-hidden border-t border-neutral-900">
      {/* Background ambient lighting in footer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-25">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#2563EB]/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-[350px] h-[350px] rounded-full bg-[#E91E63]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-16 md:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 inline-block">
                <img
                  src={logoImg}
                  alt="Little Flowers Academy"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-headline font-bold text-lg text-white block leading-tight">
                  Little Flowers
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#F59E0B] font-bold">
                  Academy of Learning
                </span>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
              A premium international-standard early learning community. Where every child
              discovers their potential through joyful Montessori exploration, mental math, and
              caring mentorship.
            </p>

            {/* Social media link */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Little Flowers Academy on Instagram"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors border border-white/10"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-headline font-bold text-sm text-[#F59E0B] uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-300 hover:text-white transition-colors font-medium flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63]" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Programs (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-headline font-bold text-sm text-[#F59E0B] uppercase tracking-wider">
              Programs
            </h4>
            <ul className="mt-4 space-y-2.5">
              {programs.map((program) => (
                <li key={program}>
                  <a
                    href="#programs"
                    className="text-xs sm:text-sm text-slate-300 hover:text-white transition-colors font-medium"
                  >
                    {program}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Admissions & Contact (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-headline font-bold text-sm text-[#F59E0B] uppercase tracking-wider">
              Admissions Office
            </h4>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm text-slate-300">
              <li>Main Campus, City</li>
              <li>+91 XXXXX XXXXX</li>
              <li>info@littleflowersacademy.com</li>
            </ul>

            <div className="mt-5">
              <a
                href="https://wa.me/?text=Hello%2C%20I'm%20interested%20in%20Little%20Flowers%20Academy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-[#25D366]/20"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            &copy; {currentYear} Little Flowers Academy. All rights reserved.
          </p>
          <p className="text-slate-400 font-medium">
            Where Children Learn with Joy and Curiosity
          </p>
        </div>
      </div>
    </footer>
  );
}
