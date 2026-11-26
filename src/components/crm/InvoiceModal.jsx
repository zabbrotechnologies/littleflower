import { Printer, Download, CheckCircle2, X } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export default function InvoiceModal({ receipt, onClose }) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#E8EDF3] max-w-lg w-full shadow-2xl p-6 sm:p-8 relative text-[#172033] my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-[#172033] hover:bg-slate-100 transition-colors print:hidden cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Invoice Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8EDF3]">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo" className="h-10 w-auto object-contain" />
            <div>
              <h2 className="text-sm font-bold text-[#172033] tracking-tight">
                Little Flowers Academy
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Official Admission & Fee Receipt
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-xs font-bold text-[#4F46E5] block">
              {receipt.receipt_no}
            </span>
            <span className="text-[10px] text-[#64748B] block mt-0.5">
              {new Date(receipt.payment_date || receipt.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Billed To / Student Details */}
        <div className="py-4 grid grid-cols-2 gap-4 text-xs border-b border-[#E8EDF3]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block mb-1">
              Student Details
            </span>
            <span className="font-bold text-[#172033] block">{receipt.student_name}</span>
            <span className="text-[#64748B] block">{receipt.program}</span>
            {receipt.student_age && (
              <span className="text-[11px] text-[#64748B] block">Age: {receipt.student_age}</span>
            )}
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block mb-1">
              Parent Contact
            </span>
            <span className="font-semibold text-[#172033] block">{receipt.parent_name}</span>
            <span className="font-mono text-[11px] text-[#64748B] block">{receipt.parent_phone}</span>
            {receipt.address && (
              <span className="text-[11px] text-[#64748B] block truncate">{receipt.address}</span>
            )}
          </div>
        </div>

        {/* Fee Line Items */}
        <div className="py-4 space-y-2 border-b border-[#E8EDF3] text-xs">
          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block mb-2">
            Fee Breakdown
          </span>

          <div className="flex justify-between py-1">
            <span className="text-[#172033]">Course Tuition & Mentorship ({receipt.program})</span>
            <span className="font-medium text-[#172033]">
              ₹{Number(receipt.amount).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between py-1 text-[#64748B]">
            <span>Subscription Period</span>
            <span>
              {new Date(receipt.validity_start).toLocaleDateString('en-IN')} –{' '}
              {new Date(receipt.validity_end).toLocaleDateString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between py-1 text-[#64748B]">
            <span>Payment Mode</span>
            <span>{receipt.payment_mode || 'UPI / Online'}</span>
          </div>

          <div className="pt-2 flex justify-between border-t border-[#E8EDF3] font-bold text-sm text-[#172033]">
            <span>Total Amount Paid</span>
            <span className="text-emerald-700">₹{Number(receipt.amount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* WhatsApp Delivery Confirmation */}
        <div className="my-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dispatched to parent via WhatsApp ({receipt.parent_phone})</span>
          </div>
          <span className="font-semibold text-emerald-700 uppercase text-[10px]">VERIFIED</span>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E8EDF3] hover:bg-slate-50 text-xs font-semibold text-[#172033] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
