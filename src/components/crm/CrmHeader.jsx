import { Search, Database, Smartphone, Bell, ChevronRight, User } from 'lucide-react';

const titleMap = {
  dashboard: 'Dashboard Overview',
  billing: 'Billing & Admission',
  students: 'Student Management',
  reminders: 'Fee Expiry Reminders',
  payments: 'Payment History & Ledger',
  reports: 'Reports & Analytics',
  whatsapp: 'WhatsApp Integration Settings',
  settings: 'System & Academy Settings',
};

export default function CrmHeader({
  activeTab,
  waStatus,
  searchQuery,
  setSearchQuery,
  onClose,
  dueCount = 0,
}) {
  return (
    <header className="h-16 bg-white border-b border-[#E8EDF3] px-6 flex items-center justify-between gap-4 shrink-0">
      {/* Left: Breadcrumbs & Title */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-medium text-[#64748B]">CRM</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <h1 className="text-sm sm:text-base font-semibold text-[#172033] truncate">
          {titleMap[activeTab] || 'Dashboard'}
        </h1>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, receipts, contacts..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] text-xs text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors"
          />
        </div>
      </div>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        {dueCount > 0 && (
          <div
            className="p-1.5 text-slate-500 hover:text-[#172033] hover:bg-slate-100 rounded-lg relative cursor-pointer"
            title={`${dueCount} renewals due`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </div>
        )}

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E8EDF3]">
          <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 text-[#4F46E5] flex items-center justify-center font-semibold text-xs">
            A
          </div>
          <div className="hidden xl:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-[#172033]">Admin User</span>
            <span className="text-[10px] text-[#64748B]">Academy Staff</span>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={onClose}
          className="ml-1 text-xs font-medium text-[#64748B] hover:text-[#172033] hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-[#E8EDF3] transition-colors cursor-pointer"
        >
          Exit CRM
        </button>
      </div>
    </header>
  );
}
