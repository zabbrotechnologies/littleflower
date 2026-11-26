import { useState } from 'react';
import {
  Bell,
  Clock,
  AlertTriangle,
  AlertOctagon,
  Send,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function ExpiryRemindersView({
  admissions = [],
  onSendReminder,
  onRefresh,
  loading,
  waStatus,
}) {
  const [filterType, setFilterType] = useState('3days'); // 'all' | '7days' | '3days' | 'tomorrow' | 'expired'
  const [search, setSearch] = useState('');

  // Filter logic based on days_remaining
  const categorized = admissions.filter((item) => {
    const days = item.days_remaining !== undefined ? item.days_remaining : 0;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.student_name?.toLowerCase().includes(q) ||
      item.parent_name?.toLowerCase().includes(q) ||
      item.parent_phone?.includes(q);

    if (!matchesSearch) return false;

    if (filterType === 'tomorrow') return days >= 0 && days <= 1;
    if (filterType === '3days') return days >= 0 && days <= 3;
    if (filterType === '7days') return days >= 0 && days <= 7;
    if (filterType === 'expired') return days < 0;
    return days <= 14; // 'all' upcoming
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Buttons */}
      <div className="bg-white p-4 rounded-xl border border-[#E8EDF3] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('3days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === '3days'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border border-[#E8EDF3]'
            }`}
          >
            Expiring in ≤ 3 Days
          </button>
          <button
            onClick={() => setFilterType('tomorrow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'tomorrow'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border border-[#E8EDF3]'
            }`}
          >
            Expiring Tomorrow
          </button>
          <button
            onClick={() => setFilterType('7days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === '7days'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border border-[#E8EDF3]'
            }`}
          >
            Expiring in 7 Days
          </button>
          <button
            onClick={() => setFilterType('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'expired'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border border-[#E8EDF3]'
            }`}
          >
            Already Expired
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border border-[#E8EDF3]'
            }`}
          >
            All Upcoming
          </button>
        </div>

        <button
          onClick={onRefresh}
          className="p-2 rounded-lg border border-[#E8EDF3] text-slate-600 hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          title="Refresh Reminders"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reminders Table */}
      <div className="bg-white rounded-xl border border-[#E8EDF3] overflow-hidden">
        {categorized.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="font-semibold text-sm text-[#172033]">No Subscriptions Matching Filter</p>
            <p className="mt-1">All student accounts under this filter are current and active.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-medium">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Parent WhatsApp</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Days Left</th>
                  <th className="py-3 px-4">Monthly Fee</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF3]">
                {categorized.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#172033]">
                      {row.student_name}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">{row.program}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#172033]">{row.parent_name}</div>
                      <div className="text-[11px] text-[#64748B] font-mono">{row.parent_phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#172033]">
                      {new Date(row.validity_end).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.days_remaining < 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : row.days_remaining <= 1
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : row.days_remaining <= 3
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {row.days_remaining < 0
                          ? 'Expired'
                          : row.days_remaining === 0
                          ? 'Today'
                          : row.days_remaining === 1
                          ? 'Tomorrow'
                          : `${row.days_remaining} days`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#172033]">
                      ₹{Number(row.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSendReminder(row.id)}
                        disabled={loading || waStatus?.status !== 'connected'}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send WhatsApp Notice</span>
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
