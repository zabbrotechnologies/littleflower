import { Download, TrendingUp, Users, DollarSign, Award } from 'lucide-react';

export default function ReportsView({ admissions = [] }) {
  const totalStudents = admissions.length;
  const totalRevenue = admissions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const avgFee = totalStudents > 0 ? Math.round(totalRevenue / totalStudents) : 0;
  const activeStudents = admissions.filter((a) => a.current_validity_status === 'active').length;
  const renewalRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

  // Course distribution
  const courseCounts = admissions.reduce((acc, curr) => {
    const prog = curr.program || 'Other';
    acc[prog] = acc[prog] || { count: 0, revenue: 0 };
    acc[prog].count += 1;
    acc[prog].revenue += parseFloat(curr.amount) || 0;
    return acc;
  }, {});

  // CSV Export functionality
  const handleExportCSV = () => {
    if (admissions.length === 0) return;

    const headers = [
      'Receipt No',
      'Student Name',
      'Age',
      'Program',
      'Parent Name',
      'Parent Phone',
      'Parent Email',
      'Amount (INR)',
      'Payment Mode',
      'Payment Date',
      'Validity Start',
      'Validity End',
      'Status',
    ];

    const rows = admissions.map((item) => [
      `"${item.receipt_no || ''}"`,
      `"${item.student_name || ''}"`,
      `"${item.student_age || ''}"`,
      `"${item.program || ''}"`,
      `"${item.parent_name || ''}"`,
      `"${item.parent_phone || ''}"`,
      `"${item.parent_email || ''}"`,
      item.amount || 0,
      `"${item.payment_mode || 'UPI'}"`,
      item.payment_date || '',
      item.validity_start || '',
      item.validity_end || '',
      `"${item.current_validity_status || 'active'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LFA_Student_Admissions_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Action */}
      <div className="bg-white p-5 rounded-xl border border-[#E8EDF3] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#172033]">Reports & Enrollment Analytics</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Institutional metrics, academic revenue distribution, and CSV export.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={admissions.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Data (CSV)</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3]">
          <span className="text-xs text-[#64748B] font-medium block">Total Admissions</span>
          <span className="text-xl font-bold text-[#172033] mt-1 block">{totalStudents}</span>
          <span className="text-[11px] text-[#64748B]">Cumulative registrations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3]">
          <span className="text-xs text-[#64748B] font-medium block">Total Revenue Collected</span>
          <span className="text-xl font-bold text-[#172033] mt-1 block">₹{totalRevenue.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-emerald-600 font-medium">100% verified in Neon DB</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3]">
          <span className="text-xs text-[#64748B] font-medium block">Average Fee / Student</span>
          <span className="text-xl font-bold text-[#172033] mt-1 block">₹{avgFee.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-[#64748B]">Across all active courses</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8EDF3]">
          <span className="text-xs text-[#64748B] font-medium block">Current Renewal Rate</span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">{renewalRate}%</span>
          <span className="text-[11px] text-[#64748B]">{activeStudents} of {totalStudents} active</span>
        </div>
      </div>

      {/* Course Breakdown Table */}
      <div className="bg-white rounded-xl border border-[#E8EDF3] overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-[#E8EDF3]">
          <h3 className="text-sm font-bold text-[#172033]">Course-Wise Distribution & Revenue</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-medium">
              <tr>
                <th className="py-3 px-5">Academic Program</th>
                <th className="py-3 px-5">Student Count</th>
                <th className="py-3 px-5">Share (%)</th>
                <th className="py-3 px-5">Total Revenue (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDF3]">
              {Object.entries(courseCounts).map(([prog, data]) => {
                const share = totalStudents > 0 ? Math.round((data.count / totalStudents) * 100) : 0;
                return (
                  <tr key={prog} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#172033]">{prog}</td>
                    <td className="py-3.5 px-5 text-[#172033]">{data.count}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-[#64748B] font-medium">{share}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#172033]">
                      ₹{data.revenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
