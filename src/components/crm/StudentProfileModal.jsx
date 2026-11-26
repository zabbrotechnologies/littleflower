import { useState } from 'react';
import { X, User, BookOpen, CreditCard, Activity, Calendar, Phone, Mail, MapPin } from 'lucide-react';

export default function StudentProfileModal({ student, onClose, onEdit, onViewInvoice }) {
  const [profileTab, setProfileTab] = useState('overview'); // 'overview' | 'course' | 'billing' | 'activity'

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#E8EDF3] max-w-xl w-full shadow-2xl p-6 relative text-[#172033]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-[#172033] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Profile Summary */}
        <div className="flex items-center gap-4 pb-5 border-b border-[#E8EDF3]">
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 text-[#4F46E5] font-bold text-base flex items-center justify-center shrink-0">
            {student.student_name ? student.student_name.slice(0, 2).toUpperCase() : 'ST'}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#172033]">{student.student_name}</h3>
            <p className="text-xs text-[#64748B]">
              {student.program} • Enrolled on {new Date(student.payment_date || student.created_at).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-[#E8EDF3] gap-2 pt-3">
          <button
            onClick={() => setProfileTab('overview')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              profileTab === 'overview'
                ? 'border-[#4F46E5] text-[#4F46E5]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setProfileTab('course')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              profileTab === 'course'
                ? 'border-[#4F46E5] text-[#4F46E5]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Course Details
          </button>
          <button
            onClick={() => setProfileTab('billing')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              profileTab === 'billing'
                ? 'border-[#4F46E5] text-[#4F46E5]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Billing & Invoices
          </button>
          <button
            onClick={() => setProfileTab('activity')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              profileTab === 'activity'
                ? 'border-[#4F46E5] text-[#4F46E5]'
                : 'border-transparent text-[#64748B] hover:text-[#172033]'
            }`}
          >
            Activity History
          </button>
        </div>

        {/* Tab Body */}
        <div className="py-5 min-h-[180px] text-xs space-y-3">
          {/* OVERVIEW */}
          {profileTab === 'overview' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">Parent / Guardian</span>
                  <span className="font-semibold text-[#172033] block mt-0.5">{student.parent_name}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">WhatsApp Phone</span>
                  <span className="font-semibold font-mono text-[#172033] block mt-0.5">{student.parent_phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">Email Address</span>
                  <span className="font-medium text-[#172033] block mt-0.5">{student.parent_email || 'Not provided'}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">Date of Birth / Age</span>
                  <span className="font-medium text-[#172033] block mt-0.5">
                    {student.student_dob || 'N/A'} {student.student_age ? `(${student.student_age})` : ''}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                <span className="text-[#64748B] block text-[11px]">Location / Address</span>
                <span className="text-[#172033] block mt-0.5">{student.address || 'Academy Campus Registered'}</span>
              </div>
            </div>
          )}

          {/* COURSE */}
          {profileTab === 'course' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">Academic Course</span>
                  <span className="font-semibold text-[#172033] block mt-0.5">{student.program}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">Subscription Status</span>
                  <span className="font-semibold text-emerald-700 block mt-0.5 uppercase text-[11px]">
                    {student.current_validity_status || 'active'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">Validity Start</span>
                  <span className="font-medium text-[#172033] block mt-0.5">
                    {new Date(student.validity_start).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">Validity Expiry</span>
                  <span className="font-medium text-[#172033] block mt-0.5">
                    {new Date(student.validity_end).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* BILLING */}
          {profileTab === 'billing' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3] flex items-center justify-between">
                <div>
                  <span className="text-[#64748B] block text-[11px]">Latest Receipt No</span>
                  <span className="font-mono font-semibold text-[#4F46E5]">{student.receipt_no}</span>
                </div>
                <button
                  onClick={() => onViewInvoice(student)}
                  className="px-3 py-1.5 rounded-md bg-white border border-[#E8EDF3] text-xs font-semibold text-[#172033] hover:bg-slate-50 cursor-pointer"
                >
                  View Invoice
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">Total Fee Paid</span>
                  <span className="font-bold text-emerald-700 text-sm block mt-0.5">
                    ₹{Number(student.amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E8EDF3]">
                  <span className="text-[#64748B] block text-[11px]">Payment Mode</span>
                  <span className="font-semibold text-[#172033] block mt-0.5">{student.payment_mode || 'UPI'}</span>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY */}
          {profileTab === 'activity' && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#172033] block">Official Bill Dispatched</span>
                  <span className="text-[11px] text-[#64748B]">
                    Sent to parent WhatsApp ({student.parent_phone})
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Delivered
                </span>
              </div>
              <div className="p-3 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#172033] block">Account Created in Neon DB</span>
                  <span className="text-[11px] text-[#64748B]">
                    Enrolled into {student.program}
                  </span>
                </div>
                <span className="text-[10px] text-[#64748B]">
                  {new Date(student.created_at).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E8EDF3] flex justify-end gap-2">
          <button
            onClick={() => onEdit(student)}
            className="px-3.5 py-1.5 rounded-lg border border-[#E8EDF3] hover:bg-slate-50 text-xs font-semibold text-[#172033] transition-colors cursor-pointer"
          >
            Edit Student
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
