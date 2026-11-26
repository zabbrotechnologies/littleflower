import {
  LayoutDashboard,
  Receipt,
  Users,
  BellRing,
  CreditCard,
  BarChart3,
  Smartphone,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'billing', label: 'Billing & Admissions', icon: Receipt },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'reminders', label: 'Expiry Reminders', icon: BellRing },
  { id: 'payments', label: 'Payment History', icon: CreditCard },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'whatsapp', label: 'WhatsApp Integration', icon: Smartphone },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function CrmSidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  onMobileClose,
  counts = {},
  onClose,
  onLogout,
}) {
  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:static bg-white border-r border-[#E8EDF3] flex flex-col justify-between transition-all duration-200 shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-[72px] w-64' : 'w-64'}`}
      >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E8EDF3]">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={logoImg}
              alt="Little Flowers Academy"
              className="h-8 w-auto object-contain shrink-0"
            />
            {!collapsed && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-semibold text-sm text-[#172033] truncate">
                  Little Flowers
                </span>
                <span className="text-[11px] text-[#64748B] font-medium truncate">
                  Education CRM
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors hidden lg:flex items-center justify-center"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Close CRM menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleSelectTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer group relative ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#172033]'
                }`}
                title={collapsed ? label : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#4F46E5] rounded-r-sm" />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#4F46E5]' : 'text-[#64748B] group-hover:text-[#172033]'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate flex-1">{label}</span>
                )}
                {!collapsed && id === 'reminders' && counts.reminders > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {counts.reminders}
                  </span>
                )}
                {!collapsed && id === 'students' && counts.students > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {counts.students}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-3 border-t border-[#E8EDF3] space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className={`flex items-center gap-2 py-2 px-2.5 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors cursor-pointer w-full ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Back to Public Website"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Back to Website</span>}
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
