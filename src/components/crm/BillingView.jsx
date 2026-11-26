import { useState, useEffect } from 'react';
import {
  Upload,
  User,
  BookOpen,
  CreditCard,
  Send,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react';

export default function BillingView({
  waStatus,
  onAdmissionSubmit,
  loading,
  setActiveTab,
}) {
  const [formData, setFormData] = useState({
    // Section A - Student Info
    studentName: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    studentDob: '',
    studentAge: '',
    address: '',

    // Section B - Course Info
    program: 'Montessori Early Years',
    courseDuration: '1 Month (30 Days)',
    validityDays: 30,
    learningMode: 'In-Person Academy',
    admissionDate: new Date().toISOString().slice(0, 10),
    courseStartDate: new Date().toISOString().slice(0, 10),

    // Section C - Billing Info
    admissionFee: 500,
    monthlyFee: 3000,
    discount: 0,
    amountPaid: 3500,
    paymentMode: 'UPI',
    paymentDate: new Date().toISOString().slice(0, 10),
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  // Auto calculate total amount
  const admissionFeeNum = parseFloat(formData.admissionFee) || 0;
  const monthlyFeeNum = parseFloat(formData.monthlyFee) || 0;
  const discountNum = parseFloat(formData.discount) || 0;
  const calculatedTotal = Math.max(0, admissionFeeNum + monthlyFeeNum - discountNum);
  const amountPaidNum = parseFloat(formData.amountPaid) || 0;
  const outstandingBalance = Math.max(0, calculatedTotal - amountPaidNum);

  // Auto calculate expiry date
  const startDate = new Date(formData.courseStartDate || Date.now());
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + parseInt(formData.validityDays || 30, 10));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdmissionSubmit({
      ...formData,
      amount: calculatedTotal,
      totalAmount: calculatedTotal,
      photoPreview,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* WhatsApp Gate Warning if not connected */}
      {waStatus?.status !== 'connected' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900">
              <span className="font-semibold block">WhatsApp Pairing Required for Billing</span>
              <span>
                To send official automated fee receipts to parents, please pair WhatsApp first.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
          >
            Connect WhatsApp
          </button>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E8EDF3] p-6 sm:p-8 space-y-8">
        <div>
          <h2 className="text-base font-bold text-[#172033]">New Student Admission & Invoice Generation</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Fill in student details, program duration, and fee structure. An official receipt will be generated and dispatched.
          </p>
        </div>

        {/* SECTION A – STUDENT INFORMATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8EDF3]">
            <User className="w-4 h-4 text-[#4F46E5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              Section A: Student & Parent Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            {/* Student Photo Preview */}
            <div className="sm:col-span-3 flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-lg border border-dashed border-[#E8EDF3] bg-[#F8FAFC] flex items-center justify-center overflow-hidden hover:border-[#4F46E5] transition-colors">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                    <span className="text-[10px] font-medium text-[#64748B]">Upload Photo</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Upload student photo"
                />
              </div>
              <span className="text-[10px] text-[#64748B] mt-1.5 text-center">
                Preview only (kept off-DB)
              </span>
            </div>

            {/* Inputs */}
            <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#172033] mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172033] mb-1">
                  Parent / Guardian Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172033] mb-1">
                  Parent WhatsApp Mobile <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="e.g. +91 98401 23456"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] font-mono focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172033] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172033] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.studentDob}
                  onChange={(e) => setFormData({ ...formData, studentDob: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172033] mb-1">
                  Location / Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Anna Nagar, Chennai"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION B – COURSE INFORMATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8EDF3]">
            <BookOpen className="w-4 h-4 text-[#4F46E5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              Section B: Course & Subscription Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Enrolling Program <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              >
                <option value="Montessori Early Years">Montessori Early Years</option>
                <option value="Abacus Mental Math">Abacus Mental Math</option>
                <option value="Academic Tuition">Academic Tuition</option>
                <option value="Handwriting & Motor Skills">Handwriting & Motor Skills</option>
                <option value="Early Phonics & Language">Early Phonics & Language</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Course Duration / Cycle
              </label>
              <select
                value={formData.validityDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    validityDays: parseInt(e.target.value, 10),
                    courseDuration: `${e.target.value} Days`,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              >
                <option value={30}>1 Month (30 Days)</option>
                <option value={90}>Quarterly (90 Days)</option>
                <option value={180}>Half-Year (180 Days)</option>
                <option value={365}>Annual (365 Days)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Learning Mode
              </label>
              <select
                value={formData.learningMode}
                onChange={(e) => setFormData({ ...formData, learningMode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              >
                <option value="In-Person Academy">In-Person Academy</option>
                <option value="Hybrid (In-Person + Online)">Hybrid Mode</option>
                <option value="Online Mentorship">Online Mentorship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Admission Date
              </label>
              <input
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              >
              </input>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Course Start Date
              </label>
              <input
                type="date"
                value={formData.courseStartDate}
                onChange={(e) => setFormData({ ...formData, courseStartDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Calculated Expiry Date
              </label>
              <input
                type="text"
                disabled
                value={expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] text-xs font-semibold text-[#172033]"
              />
            </div>
          </div>
        </div>

        {/* SECTION C – BILLING INFORMATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8EDF3]">
            <CreditCard className="w-4 h-4 text-[#4F46E5]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              Section C: Fee Breakdown & Payment Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Admission Fee (₹)
              </label>
              <input
                type="number"
                value={formData.admissionFee}
                onChange={(e) => setFormData({ ...formData, admissionFee: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Monthly Tuition Fee (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs font-semibold text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Scholarship / Discount (₹)
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Total Amount Payable (₹)
              </label>
              <input
                type="text"
                disabled
                value={`₹${calculatedTotal.toLocaleString('en-IN')}`}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] text-xs font-bold text-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Amount Paid Today (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs font-bold text-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Outstanding Balance (₹)
              </label>
              <input
                type="text"
                disabled
                value={`₹${outstandingBalance.toLocaleString('en-IN')}`}
                className={`w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] text-xs font-semibold ${
                  outstandingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Cash">Cash at Academy Desk</option>
                <option value="Bank Transfer">Bank Transfer / NEFT</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>
          </div>
        </div>

        {/* SECTION D – SUBMISSION & ACTION */}
        <div className="pt-4 border-t border-[#E8EDF3] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#64748B]">
            <span className="font-medium text-[#172033] block">Automated Receipt Dispatch:</span>
            <span>Parent will receive official bill receipt on WhatsApp mobile immediately upon creation.</span>
          </div>

          <button
            type="submit"
            disabled={loading || waStatus?.status !== 'connected'}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>
              {loading
                ? 'Processing Admission...'
                : waStatus?.status !== 'connected'
                ? 'Pair WhatsApp to Generate Bill'
                : 'Generate Invoice & Dispatch WhatsApp Bill'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
