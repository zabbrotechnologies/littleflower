import { useState, useEffect, useCallback } from 'react';
import CrmSidebar from './crm/CrmSidebar';
import CrmHeader from './crm/CrmHeader';
import DashboardView from './crm/DashboardView';
import BillingView from './crm/BillingView';
import StudentsView from './crm/StudentsView';
import ExpiryRemindersView from './crm/ExpiryRemindersView';
import PaymentsView from './crm/PaymentsView';
import ReportsView from './crm/ReportsView';
import WhatsAppView from './crm/WhatsAppView';
import SettingsView from './crm/SettingsView';
import InvoiceModal from './crm/InvoiceModal';
import StudentProfileModal from './crm/StudentProfileModal';
import EditStudentModal from './crm/EditStudentModal';

export default function AdminDashboard({ onClose, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [waStatus, setWaStatus] = useState({ status: 'disconnected', phoneNumber: null, qrCodeDataUrl: null });
  const [admissions, setAdmissions] = useState([]);
  const [dueReminders, setDueReminders] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch WhatsApp status
  const fetchWhatsAppStatus = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/whatsapp/status`);
      if (res.ok) {
        const data = await res.json();
        setWaStatus(data);
      }
    } catch {
      // Offline fallback
    }
  }, [apiUrl]);

  // Fetch admissions from Neon DB
  const fetchAdmissions = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admissions`);
      if (res.ok) {
        const data = await res.json();
        setAdmissions(data);
      }
    } catch {
      // Offline fallback
    }
  }, [apiUrl]);

  // Fetch 3-day due reminders
  const fetchDueReminders = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/reminders/due`);
      if (res.ok) {
        const data = await res.json();
        setDueReminders(data);
      }
    } catch {
      // Offline fallback
    }
  }, [apiUrl]);

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/reports/analytics`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch {
      // Offline fallback
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchWhatsAppStatus();
    fetchAdmissions();
    fetchDueReminders();
    fetchAnalytics();
    const interval = setInterval(fetchWhatsAppStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchWhatsAppStatus, fetchAdmissions, fetchDueReminders, fetchAnalytics]);

  // WhatsApp actions
  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/whatsapp/qr`, { method: 'POST' });
      const data = await res.json();
      setWaStatus((prev) => ({ ...prev, status: 'qr_ready', qrCodeDataUrl: data.qrCodeDataUrl }));
      showToast('QR Code generated. Scan with WhatsApp > Linked Devices.');
    } catch (err) {
      showToast('Error generating QR: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLink = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/whatsapp/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: '+91 94422 66789' }),
      });
      const data = await res.json();
      if (data.success) {
        setWaStatus(data.session);
        showToast('WhatsApp successfully linked and saved to Neon DB!');
      }
    } catch (err) {
      showToast('Connection error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/whatsapp/disconnect`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setWaStatus(data.session);
        showToast('WhatsApp session disconnected.', 'warning');
      }
    } catch (err) {
      showToast('Error disconnecting: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Submit Admission & Auto-Dispatch Bill
  const handleAdmissionSubmit = async (formData) => {
    if (waStatus.status !== 'connected') {
      showToast('Please pair WhatsApp first to enable automated bill dispatch.', 'error');
      setActiveTab('whatsapp');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Admission saved to Neon DB & official receipt sent to ${formData.parentPhone} via WhatsApp!`);
        setSelectedReceipt({
          ...data.admission,
          billMessage: data.billMessage,
          photo: formData.photoPreview,
        });

        await fetchAdmissions();
        await fetchDueReminders();
        await fetchAnalytics();
        setActiveTab('students'); // Auto-redirect to Students Record!
      } else {
        showToast(data.error || 'Failed to register admission.', 'error');
      }
    } catch (err) {
      showToast('Network error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Send Expiry Reminder
  const handleSendReminder = async (admissionId) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/reminders/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admissionId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Renewal reminder dispatched to parent WhatsApp successfully!');
      } else {
        showToast(data.error || 'Failed to dispatch reminder', 'error');
      }
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save Edit Student
  const handleSaveStudentEdit = async (studentId, updatedFields) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admissions/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Student record updated in Neon PostgreSQL successfully!');
        setEditingStudent(null);
        fetchAdmissions();
        fetchDueReminders();
      } else {
        showToast(data.error || 'Failed to update student', 'error');
      }
    } catch (err) {
      showToast('Error updating student: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Confirm Delete Student
  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admissions/${deletingStudent.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Student record ${deletingStudent.student_name} deleted from Neon DB.`);
        setDeletingStudent(null);
        fetchAdmissions();
        fetchDueReminders();
        fetchAnalytics();
      } else {
        showToast(data.error || 'Failed to delete student', 'error');
      }
    } catch (err) {
      showToast('Error deleting student: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#F8FAFC] text-[#172033] flex overflow-hidden font-body antialiased selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      {/* ── LEFT SIDEBAR ── */}
      <CrmSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        counts={{
          students: admissions.length,
          reminders: dueReminders.length,
        }}
        onClose={onClose}
        onLogout={onLogout}
      />

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <CrmHeader
          activeTab={activeTab}
          waStatus={waStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClose={onClose}
          dueCount={dueReminders.length}
        />

        {/* Global Toast Notification */}
        {notification && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between shrink-0 transition-all ${
              notification.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-b border-rose-200'
                : notification.type === 'warning'
                ? 'bg-amber-50 text-amber-800 border-b border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="font-bold ml-4 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable View Container */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              admissions={admissions}
              dueReminders={dueReminders}
              analytics={analytics}
              setActiveTab={setActiveTab}
              onSendReminder={handleSendReminder}
              onSelectReceipt={setSelectedReceipt}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView
              waStatus={waStatus}
              onAdmissionSubmit={handleAdmissionSubmit}
              loading={loading}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              admissions={admissions}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onRefresh={fetchAdmissions}
              onNewAdmission={() => setActiveTab('billing')}
              onViewProfile={setSelectedProfile}
              onEditStudent={setEditingStudent}
              onDeleteStudent={setDeletingStudent}
              onViewReceipt={setSelectedReceipt}
            />
          )}

          {activeTab === 'reminders' && (
            <ExpiryRemindersView
              admissions={admissions}
              onSendReminder={handleSendReminder}
              onRefresh={fetchDueReminders}
              loading={loading}
              waStatus={waStatus}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsView
              admissions={admissions}
              onSelectReceipt={setSelectedReceipt}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              admissions={admissions}
            />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppView
              waStatus={waStatus}
              onGenerateQR={handleGenerateQR}
              onConfirmLink={handleConfirmLink}
              onDisconnect={handleDisconnect}
              loading={loading}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* ── INVOICE RECEIPT MODAL ── */}
      {selectedReceipt && (
        <InvoiceModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* ── STUDENT PROFILE MODAL ── */}
      {selectedProfile && (
        <StudentProfileModal
          student={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onEdit={(s) => {
            setSelectedProfile(null);
            setEditingStudent(s);
          }}
          onViewInvoice={(s) => {
            setSelectedProfile(null);
            setSelectedReceipt(s);
          }}
        />
      )}

      {/* ── EDIT STUDENT MODAL ── */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleSaveStudentEdit}
          loading={loading}
        />
      )}

      {/* ── DELETE CONFIRMATION DIALOG ── */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#E8EDF3] max-w-sm w-full p-6 space-y-4 text-[#172033]">
            <h4 className="text-sm font-bold text-[#172033]">Confirm Student Deletion</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <b className="text-[#172033]">{deletingStudent.student_name}</b> (Receipt: {deletingStudent.receipt_no})? This action will remove the record from Neon PostgreSQL.
            </p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-3 py-1.5 rounded-lg border border-[#E8EDF3] hover:bg-slate-50 text-xs font-medium text-[#64748B] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {loading ? 'Deleting...' : 'Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
