import { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  RefreshCw,
  MoreVertical,
  FileText,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function StudentsView({
  admissions = [],
  searchQuery,
  setSearchQuery,
  onRefresh,
  onNewAdmission,
  onViewProfile,
  onEditStudent,
  onDeleteStudent,
  onViewReceipt,
}) {
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = admissions.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.student_name?.toLowerCase().includes(q) ||
      item.parent_name?.toLowerCase().includes(q) ||
      item.parent_phone?.includes(q) ||
      item.receipt_no?.toLowerCase().includes(q);

    const matchesCourse = courseFilter === 'all' || item.program === courseFilter;
    const matchesStatus = statusFilter === 'all' || item.current_validity_status === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8EDF3] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, parent phone, receipt..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] text-xs text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] text-xs text-[#172033] font-medium focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
          >
            <option value="all">All Courses</option>
            <option value="Montessori Early Years">Montessori Early Years</option>
            <option value="Abacus Mental Math">Abacus Mental Math</option>
            <option value="Academic Tuition">Academic Tuition</option>
            <option value="Handwriting & Motor Skills">Handwriting & Motor Skills</option>
            <option value="Early Phonics & Language">Early Phonics & Language</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] text-xs text-[#172033] font-medium focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expiring_soon">Expiring (≤3 Days)</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg border border-[#E8EDF3] text-slate-600 hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNewAdmission}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-[#E8EDF3] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">
            <p className="font-semibold text-sm text-[#172033]">No student records found</p>
            <p className="mt-1">Try adjusting your search criteria or register a new admission.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-medium">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Course & Program</th>
                  <th className="py-3 px-4">Parent / Mobile</th>
                  <th className="py-3 px-4">Fee Paid</th>
                  <th className="py-3 px-4">Validity End</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF3]">
                {filtered.map((student) => {
                  const initials = student.student_name
                    ? student.student_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'ST';

                  return (
                    <tr key={student.id} className="hover:bg-[#F8FAFC] transition-colors">
                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-[10px] shrink-0 border border-slate-200">
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-[#172033] block">
                              {student.student_name}
                            </span>
                            {student.student_age && (
                              <span className="text-[10px] text-[#64748B] block">
                                {student.student_age}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Receipt */}
                      <td className="py-3 px-4 font-mono text-[11px] font-semibold text-[#4F46E5]">
                        {student.receipt_no}
                      </td>

                      {/* Program */}
                      <td className="py-3 px-4 text-[#172033]">
                        {student.program}
                      </td>

                      {/* Parent */}
                      <td className="py-3 px-4">
                        <div className="text-[#172033] font-medium">{student.parent_name}</div>
                        <div className="text-[11px] text-[#64748B] font-mono">{student.parent_phone}</div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 font-semibold text-[#172033]">
                        ₹{Number(student.amount).toLocaleString('en-IN')}
                        <span className="block text-[10px] text-[#64748B] font-normal">
                          {student.payment_mode}
                        </span>
                      </td>

                      {/* Validity */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-[#172033] block">
                          {new Date(student.validity_end).toLocaleDateString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#64748B]">
                          {student.days_remaining > 0
                            ? `${student.days_remaining} days left`
                            : 'Expired'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            student.current_validity_status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : student.current_validity_status === 'expiring_soon'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {student.current_validity_status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* WhatsApp Sent */}
                      <td className="py-3 px-4">
                        {student.whatsapp_sent ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Pending</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewProfile(student)}
                            className="p-1 text-slate-500 hover:text-[#4F46E5] hover:bg-indigo-50 rounded transition-colors"
                            title="View Profile Details"
                            aria-label="View Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onViewReceipt(student)}
                            className="p-1 text-slate-500 hover:text-[#4F46E5] hover:bg-indigo-50 rounded transition-colors"
                            title="View Invoice"
                            aria-label="View Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditStudent(student)}
                            className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            title="Edit Record"
                            aria-label="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(student)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Student"
                            aria-label="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table footer count */}
        <div className="p-3 bg-[#F8FAFC] border-t border-[#E8EDF3] flex items-center justify-between text-xs text-[#64748B]">
          <span>
            Showing <b>{filtered.length}</b> of <b>{admissions.length}</b> students
          </span>
        </div>
      </div>
    </div>
  );
}
