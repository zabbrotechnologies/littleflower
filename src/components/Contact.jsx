import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Send,
  CheckCircle,
} from 'lucide-react';

const contactChannels = [
  {
    icon: MapPin,
    title: 'Academy Campus',
    detail: 'Main Campus Address, City, State, India',
    note: 'Visits welcomed Mon–Sat: 9:00 AM – 4:00 PM',
    accentBg: '#EFF6FF',
    iconColor: '#2563EB',
  },
  {
    icon: Phone,
    title: 'Admissions Desk',
    detail: '+91 XXXXX XXXXX',
    note: 'Direct phone consultations & inquiry support',
    accentBg: '#FCE4EC',
    iconColor: '#E91E63',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Admissions',
    detail: '+91 XXXXX XXXXX',
    note: 'Instant chat, brochure & fee structure queries',
    accentBg: '#E8F5E9',
    iconColor: '#25D366',
  },
  {
    icon: Mail,
    title: 'Email Correspondence',
    detail: 'info@littleflowersacademy.com',
    note: 'Formal admissions & general administration',
    accentBg: '#FEF3C7',
    iconColor: '#D97706',
  },
];

const ageOptions = [
  '2.5 – 3.5 years (Toddler Montessori)',
  '3.5 – 4.5 years (Primary Montessori)',
  '4.5 – 6 years (Preparatory Montessori)',
  '6 – 8 years (Early Primary / Abacus)',
  '8 – 12 years (Middle Years / Tuition)',
  '12+ years (Upper Grades)',
];

const programOptions = [
  'Montessori Learning (Early Childhood)',
  'Abacus Mental Arithmetic Training',
  'Academic Tuition (Grades 1 – 8)',
  'Integrated Multi-Program Enrollment',
];

const initialFormData = {
  parentName: '',
  childName: '',
  childAge: '',
  phone: '',
  program: '',
  message: '',
};

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.parentName.trim())
      newErrors.parentName = 'Parent name is required';
    if (!formData.childName.trim())
      newErrors.childName = 'Child name is required';
    if (!formData.childAge) newErrors.childAge = 'Please select child age';
    if (!formData.program) newErrors.program = 'Please select a program';

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Admission Enquiry Submitted:', formData);
      setSubmitted(true);
    }
  };

  const inputClasses =
    'w-full rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3.5 text-sm text-[#1E293B] focus:border-[#E91E63] focus:ring-4 focus:ring-[#E91E63]/10 outline-none transition duration-200 placeholder:text-slate-400 font-medium backdrop-blur-md';
  const labelClasses = 'block text-xs font-bold text-[#1E293B] uppercase tracking-wider mb-1.5';
  const errorClasses = 'text-rose-500 text-xs font-semibold mt-1';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative pb-24 md:pb-32 overflow-hidden scroll-mt-12"
    >
      {/* ── GIANT FADED BACKGROUND WATERMARK (Positioned cleanly at top) ── */}
      <div className="absolute top-2 sm:top-4 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-headline font-black text-7xl sm:text-8xl md:text-8xl lg:text-[9.5rem] xl:text-[11rem] uppercase tracking-tighter bg-gradient-to-b from-slate-900/[0.16] via-slate-900/[0.05] to-transparent bg-clip-text text-transparent leading-none whitespace-nowrap">
          CONTACT US
        </span>
      </div>

      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-[#EFF6FF]/60 blur-3xl" />
        <div className="absolute bottom-10 -left-32 w-[450px] h-[450px] rounded-full bg-[#FCE4EC]/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 md:pt-44 lg:pt-48">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E293B] leading-tight">
            Connect with Our <span className="text-[#E91E63]">Admissions Team</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            We invite you to tour our classrooms, meet our educators, and explore our customized
            learning pathways for your child.
          </p>
        </motion.div>

        {/* 2-Column Glassmorphism Layout */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* LEFT: Contact Information Channels & Google Maps (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-4"
          >
            {contactChannels.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(30,41,59,0.06)] hover:shadow-[0_12px_36px_rgba(30,41,59,0.1)] transition-all flex items-start gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: item.accentBg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.iconColor }} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: item.iconColor }}>
                      {item.title}
                    </p>
                    <p className="text-sm sm:text-base font-headline font-bold text-[#1E293B] mt-0.5">
                      {item.detail}
                    </p>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      {item.note}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Google Maps Card */}
            <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(30,41,59,0.06)]">
              <div className="h-44 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#F8FAFC] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-4">
                <div className="w-11 h-11 rounded-2xl bg-white shadow-xs flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-[#2563EB]" />
                </div>
                <p className="font-headline font-bold text-sm text-[#1E293B]">
                  Little Flowers Academy Campus
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conveniently situated in a tranquil, child-safe neighborhood
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: High-Conversion Admission Enquiry Glass Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 rounded-[2.2rem] bg-white/85 backdrop-blur-2xl border border-white p-7 sm:p-10 shadow-[0_16px_45px_rgba(30,41,59,0.08)]"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex min-h-[440px] flex-col items-center justify-center text-center p-6"
              >
                <div className="mb-4 rounded-3xl bg-[#FCE4EC] p-5 shadow-xs">
                  <CheckCircle className="h-12 w-12 text-[#E91E63]" />
                </div>
                <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
                  Enquiry Received!
                </h3>
                <p className="mt-3 max-w-sm text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  Thank you for reaching out to Little Flowers Academy. Our admissions
                  coordinator will contact you within 24 hours to schedule your campus visit.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData(initialFormData);
                  }}
                  className="mt-6 text-xs font-bold uppercase tracking-wider text-[#E91E63] hover:underline cursor-pointer"
                >
                  Submit Another Enquiry
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-8 pb-4 border-b border-slate-100">
                  <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
                    Admission Enquiry Form
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                    Please provide your contact details. We will assist you with enrollment and program selection.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                  {/* Parent Name */}
                  <div>
                    <label htmlFor="parentName" className={labelClasses}>
                      Parent / Guardian Name <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="e.g. Radhika Sharma"
                      className={`${inputClasses} ${errors.parentName ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                    />
                    {errors.parentName && (
                      <p className={errorClasses}>{errors.parentName}</p>
                    )}
                  </div>

                  {/* Child Name */}
                  <div>
                    <label htmlFor="childName" className={labelClasses}>
                      Child&apos;s Name <span className="text-[#E91E63]">*</span>
                    </label>
                    <input
                      type="text"
                      id="childName"
                      name="childName"
                      value={formData.childName}
                      onChange={handleChange}
                      placeholder="e.g. Advait"
                      className={`${inputClasses} ${errors.childName ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                    />
                    {errors.childName && (
                      <p className={errorClasses}>{errors.childName}</p>
                    )}
                  </div>

                  {/* Child Age & Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="childAge" className={labelClasses}>
                        Child Age <span className="text-[#E91E63]">*</span>
                      </label>
                      <select
                        id="childAge"
                        name="childAge"
                        value={formData.childAge}
                        onChange={handleChange}
                        className={`${inputClasses} ${!formData.childAge ? 'text-slate-400' : ''} ${errors.childAge ? 'border-rose-400' : ''}`}
                      >
                        <option value="">Select age group</option>
                        {ageOptions.map((age) => (
                          <option key={age} value={age}>
                            {age}
                          </option>
                        ))}
                      </select>
                      {errors.childAge && (
                        <p className={errorClasses}>{errors.childAge}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelClasses}>
                        Phone Number <span className="text-[#E91E63]">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className={`${inputClasses} ${errors.phone ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                      />
                      {errors.phone && (
                        <p className={errorClasses}>{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Program Interested */}
                  <div>
                    <label htmlFor="program" className={labelClasses}>
                      Interested Program <span className="text-[#E91E63]">*</span>
                    </label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      className={`${inputClasses} ${!formData.program ? 'text-slate-400' : ''} ${errors.program ? 'border-rose-400' : ''}`}
                    >
                      <option value="">Select learning program</option>
                      {programOptions.map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                    {errors.program && (
                      <p className={errorClasses}>{errors.program}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className={labelClasses}>
                      Notes or Questions <span className="text-slate-400 lowercase font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Share preferred visit times, prior schooling experience, or specific questions..."
                      className={`${inputClasses} resize-none`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E91E63] hover:bg-[#D81B60] py-4 text-sm sm:text-base font-bold text-white shadow-[0_12px_32px_rgba(233,30,99,0.3)] border border-white/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Admission Enquiry</span>
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
