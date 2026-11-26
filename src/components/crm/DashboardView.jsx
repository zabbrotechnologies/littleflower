import {
  Users,
  UserCheck,
  Clock,
  AlertOctagon,
  IndianRupee,
  CreditCard,
  ArrowUpRight,
  Send,
  Plus,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardView({
  admissions = [],
  dueReminders = [],
  analytics = {},
  setActiveTab,
  onSendReminder,
  onSelectReceipt,
}) {
  const totalStudents = admissions.length;
  const activeStudents = admissions.filter((a) => a.current_validity_status === 'active').length;
  const expiringSoon = admissions.filter((a) => a.current_validity_status === 'expiring_soon').length;
  const expiredStudents = admissions.filter((a) => a.current_validity_status === 'expired').length;
  const totalRevenue = admissions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  // Course distribution breakdown
  const programCounts = admissions.reduce((acc, curr) => {
    const prog = curr.program || 'Other';
    acc[prog] = (acc[prog] || 0) + 1;
    return acc;
  }, {});

  const recentAdmissions = admissions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EDF3]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#172033]">
            Welcome to Little Flowers Academy Dashboard
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time enrollment, automated billing, and fee validity lifecycle management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('billing')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Admission</span>
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#172033] border border-[#E8EDF3] text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Review Expiries</span>
            {dueReminders.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>
        </div>
      </div>

      {/* 6 Professional KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Students */}
        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Total Enrolled</span>
            <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-[#172033]">{totalStudents}</span>
            <span className="text-[11px] text-[#64748B] block mt-0.5">All programs</span>
          </div>
        </div>

        {/* Active Students */}
        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Active Subscriptions</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-emerald-700">{activeStudents}</span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">Valid sessions</span>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Expiring (≤3 Days)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-amber-700">{expiringSoon}</span>
            <span className="text-[11px] text-amber-600 block mt-0.5">Action needed</span>
          </div>
        </div>

        {/* Expired Students */}
        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Expired Validity</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-rose-700">{expiredStudents}</span>
            <span className="text-[11px] text-rose-600 block mt-0.5">Pending renewal</span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Fee Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-bold text-[#172033]">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Collected
            </span>
          </div>
        </div>

        {/* WhatsApp Deliveries */}
        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">WhatsApp Bills</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-[#172033]">
              {admissions.filter((a) => a.whatsapp_sent).length}
            </span>
            <span className="text-[11px] text-[#64748B] block mt-0.5">Delivered to parents</span>
          </div>
        </div>
      </div>

      {/* Upcoming Expiry Notice Card */}
      <div className="bg-white p-5 rounded-xl border border-[#E8EDF3] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8EDF3] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Upcoming Expiry Notice</h3>
            <p className="text-xs text-[#64748B]">Subscriptions expiring within 3 days</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              {dueReminders.length} Due
            </span>
            <button
              onClick={() => setActiveTab('reminders')}
              className="text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1 cursor-pointer ml-2"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          {dueReminders.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#64748B]">
              No subscriptions expiring in the next 3 days. All accounts in good standing!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {dueReminders.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#172033] truncate">
                      {item.student_name}
                    </p>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {item.program} • Due in {item.days_remaining} {item.days_remaining === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                  <button
                    onClick={() => onSendReminder(item.id)}
                    className="px-2.5 py-1 rounded-md bg-white border border-[#E8EDF3] hover:border-amber-300 hover:bg-amber-50 text-[11px] font-medium text-[#172033] shrink-0 transition-colors cursor-pointer"
                  >
                    Send Reminder
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Admissions Table */}
      <div className="bg-white rounded-xl border border-[#E8EDF3] overflow-hidden">
        <div className="p-4 sm:px-6 flex items-center justify-between border-b border-[#E8EDF3]">
          <div>
            <h3 className="text-sm font-bold text-[#172033]">Recent Student Admissions</h3>
            <p className="text-xs text-[#64748B]">Latest admission & billing records from Neon DB</p>
          </div>
          <button
            onClick={() => setActiveTab('students')}
            className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Students</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentAdmissions.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            No admissions registered yet. Click "+ New Admission" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-medium">
                <tr>
                  <th className="py-3 px-5">Receipt No</th>
                  <th className="py-3 px-5">Student</th>
                  <th className="py-3 px-5">Program</th>
                  <th className="py-3 px-5">Parent Contact</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Expiry Date</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF3]">
                {recentAdmissions.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[11px] text-[#4F46E5] font-semibold">
                      {row.receipt_no}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#172033]">
                      {row.student_name}
                    </td>
                    <td className="py-3.5 px-5 text-[#64748B]">{row.program}</td>
                    <td className="py-3.5 px-5">
                      <div className="text-[#172033]">{row.parent_name}</div>
                      <div className="text-[11px] text-[#64748B] font-mono">{row.parent_phone}</div>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#172033]">
                      ₹{Number(row.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-5 text-[#64748B]">
                      {new Date(row.validity_end).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.current_validity_status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : row.current_validity_status === 'expiring_soon'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {row.current_validity_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => onSelectReceipt(row)}
                        className="px-2.5 py-1 rounded-md bg-white border border-[#E8EDF3] hover:bg-slate-50 text-[11px] font-medium text-[#172033] transition-colors cursor-pointer"
                      >
                        View
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
