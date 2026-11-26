import { useState } from 'react';
import {
  CreditCard,
  Search,
  Download,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function PaymentsView({ admissions = [], onSelectReceipt }) {
  const [methodFilter, setMethodFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = admissions.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.student_name?.toLowerCase().includes(q) ||
      item.receipt_no?.toLowerCase().includes(q) ||
      item.parent_phone?.includes(q);

    const matchesMethod = methodFilter === 'all' || item.payment_mode === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = filtered.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  return (
    <div className="space-y-4">
      {/* Top Ledger Stats & Filter */}
      <div className="bg-white p-4 rounded-xl border border-[#E8EDF3] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#64748B] block">Filtered Total Collected</span>
          <span className="text-xl font-bold text-[#172033]">
            ₹{totalCollected.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search receipts, students, phones..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] text-xs text-[#172033] font-medium focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
          >
            <option value="all">All Methods</option>
            <option value="UPI">UPI / GPay / PhonePe</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Debit / Credit Card</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-[#E8EDF3] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">
            No payment transactions match the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-medium">
                <tr>
                  <th className="py-3 px-4">Transaction / Receipt</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF3]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#4F46E5]">
                      {item.receipt_no}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#172033]">
                      {item.student_name}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">{item.program}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {item.payment_mode || 'UPI'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#172033]">
                      {new Date(item.payment_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">
                      ₹{Number(item.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectReceipt(item)}
                        className="px-2.5 py-1 rounded-md bg-white border border-[#E8EDF3] hover:bg-slate-50 text-[11px] font-medium text-[#172033] transition-colors cursor-pointer"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
