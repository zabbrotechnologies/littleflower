import { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  ShieldCheck,
  Server,
  FileText,
  Key,
} from 'lucide-react';

export default function WhatsAppView({
  waStatus,
  onGenerateQR,
  onConfirmLink,
  onDisconnect,
  loading,
}) {
  const [testPhone, setTestPhone] = useState('');
  const [testStatus, setTestStatus] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/whatsapp/logs`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch {
      // Local fallback
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    if (!testPhone) return;

    setTestLoading(true);
    setTestStatus(null);
    try {
      const res = await fetch(`${apiUrl}/api/whatsapp/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus({ type: 'success', message: 'Test message dispatched successfully!' });
        fetchLogs();
      } else {
        setTestStatus({ type: 'error', message: data.error || 'Failed to dispatch test message' });
      }
    } catch (err) {
      setTestStatus({ type: 'error', message: err.message });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview & Mode Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E8EDF3] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8EDF3]">
          <div>
            <h2 className="text-base font-bold text-[#172033]">WhatsApp Gateway & Integration</h2>
            <p className="text-xs text-[#64748B]">
              Configure production Cloud API or local pairing for automated billing & renewal notices.
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              waStatus?.status === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {waStatus?.status === 'connected' ? '● Connected & Active' : '○ Offline / Needs Linking'}
          </span>
        </div>

        {/* Integration Architecture Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Production Integration Card */}
          <div className="p-4 rounded-xl border border-[#E8EDF3] bg-[#F8FAFC] space-y-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#4F46E5]" />
              <span className="text-xs font-bold text-[#172033]">
                Production: WhatsApp Business Cloud API
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Official Meta Graph API gateway for enterprise messaging. Uses verified business phone numbers and pre-approved HSM bill receipt templates.
            </p>
            <div className="pt-2 text-[11px] text-[#4F46E5] font-medium flex items-center gap-1">
              <span>Managed via Meta Business Manager</span>
            </div>
          </div>

          {/* Developer Sandbox Card */}
          <div className="p-4 rounded-xl border border-[#E8EDF3] bg-[#F8FAFC] space-y-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-[#172033]">
                Developer Sandbox: Web Pairing QR
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Local paired instance. Session credentials persist securely in Lakebase PostgreSQL so reboots do not disconnect your session.
            </p>
            <div className="pt-2 text-[11px] text-emerald-700 font-medium">
              <span>Status: {waStatus?.status === 'connected' ? `Linked (${waStatus?.phoneNumber})` : 'Awaiting Pair'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Pairing Panel */}
      <div className="bg-white p-6 rounded-xl border border-[#E8EDF3] space-y-6">
        <h3 className="text-sm font-bold text-[#172033] pb-3 border-b border-[#E8EDF3]">
          Device Pairing & Connection Management
        </h3>

        {waStatus?.status === 'connected' ? (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Device Paired: {waStatus?.phoneNumber || 'Academy Mobile'}
                </p>
                <p className="text-[11px] text-emerald-700">
                  Session credentials saved in Neon PostgreSQL. Automated billing dispatches are active.
                </p>
              </div>
            </div>

            <button
              onClick={onDisconnect}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
            >
              Disconnect Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* QR display */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              {waStatus?.qrCodeDataUrl ? (
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-300 inline-block">
                  <img
                    src={waStatus.qrCodeDataUrl}
                    alt="WhatsApp QR"
                    className="w-48 h-48 mx-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-xl border border-dashed border-slate-300 bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-[#64748B]">
                  <Smartphone className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-[11px]">Click below to generate QR</span>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={onGenerateQR}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {waStatus?.qrCodeDataUrl ? 'Regenerate QR' : 'Generate QR Code'}
                </button>
                <button
                  onClick={onConfirmLink}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Linked
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="md:col-span-7 space-y-2.5 text-xs text-[#64748B]">
              <p className="font-semibold text-[#172033]">Pairing instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open WhatsApp on the academy smartphone.</li>
                <li>Go to <b>Settings</b> or <b>Linked Devices</b>.</li>
                <li>Tap <b>Link a Device</b> and point camera at this QR.</li>
                <li>Click <b>Confirm Linked</b> to persist session in Neon DB.</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Test Message Dispatcher */}
      <div className="bg-white p-6 rounded-xl border border-[#E8EDF3] space-y-4">
        <h3 className="text-sm font-bold text-[#172033] pb-3 border-b border-[#E8EDF3]">
          Send Test Message
        </h3>
        <p className="text-xs text-[#64748B]">
          Verify message delivery by sending a sample academy receipt ping to any authorized phone number.
        </p>

        <form onSubmit={handleSendTestMessage} className="flex flex-wrap items-center gap-3">
          <input
            type="tel"
            required
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="+91 98401 23456"
            className="flex-1 max-w-sm px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] font-mono focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
          />
          <button
            type="submit"
            disabled={testLoading || waStatus?.status !== 'connected'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#172033] hover:bg-slate-800 text-white text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testLoading ? 'Sending...' : 'Send Test Notification'}</span>
          </button>
        </form>

        {testStatus && (
          <div
            className={`p-3 rounded-lg text-xs font-medium ${
              testStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testStatus.message}
          </div>
        )}
      </div>

      {/* Message Audit Logs */}
      <div className="bg-white rounded-xl border border-[#E8EDF3] overflow-hidden">
        <div className="p-4 sm:px-6 flex items-center justify-between border-b border-[#E8EDF3]">
          <h3 className="text-sm font-bold text-[#172033]">Recent Delivery Logs (Neon DB)</h3>
          <button
            onClick={fetchLogs}
            className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh Logs</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            No message audit logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[#64748B] font-medium">
                <tr>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Recipient Phone</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF3]">
                {logs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-semibold text-[#172033] uppercase text-[10px]">
                      {log.type}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#64748B]">
                      {log.phone}
                    </td>
                    <td className="py-3 px-4 text-[#172033]">
                      {log.student_name || 'Direct Ping'}
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">
                      {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> {log.status}
                      </span>
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
