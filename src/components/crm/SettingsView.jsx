import { useState, useEffect } from 'react';
import { Save, CheckCircle2, Building, Receipt, Lock } from 'lucide-react';

export default function SettingsView({ showToast }) {
  const [settings, setSettings] = useState({
    academyName: 'Little Flowers Academy',
    tagline: 'Joyful, World-Class Early Learning & Academic Excellence',
    contactPhone: '+91 94422 66789',
    contactEmail: 'info@littleflowersacademy.edu',
    address: '12/4 Academy Road, Anna Nagar, Chennai - 600040',
    currencySymbol: '₹',
    invoicePrefix: 'LFA',
    whatsappProvider: 'Official WhatsApp Business Cloud API',
  });
  const [saving, setSaving] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetch(`${apiUrl}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.academy_name) {
          setSettings({
            academyName: data.academy_name,
            tagline: data.tagline,
            contactPhone: data.contact_phone,
            contactEmail: data.contact_email,
            address: data.address,
            currencySymbol: data.currency_symbol,
            invoicePrefix: data.invoice_prefix,
            whatsappProvider: data.whatsapp_provider,
          });
        }
      })
      .catch(() => {});
  }, [apiUrl]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('Settings saved successfully in Neon PostgreSQL!');
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Academy Info */}
        <div className="bg-white p-6 rounded-xl border border-[#E8EDF3] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8EDF3]">
            <Building className="w-4 h-4 text-[#4F46E5]" />
            <h3 className="text-sm font-bold text-[#172033]">Academy Profile & Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Academy Name
              </label>
              <input
                type="text"
                value={settings.academyName}
                onChange={(e) => setSettings({ ...settings, academyName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Tagline / Motto
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Academy Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>
          </div>
        </div>

        {/* Invoice Configuration */}
        <div className="bg-white p-6 rounded-xl border border-[#E8EDF3] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8EDF3]">
            <Receipt className="w-4 h-4 text-[#4F46E5]" />
            <h3 className="text-sm font-bold text-[#172033]">Invoice & Receipt Configuration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Invoice Number Prefix
              </label>
              <input
                type="text"
                value={settings.invoicePrefix}
                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs font-mono text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs font-mono text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>
          </div>
        </div>

        {/* Admin Credentials Info */}
        <div className="bg-white p-6 rounded-xl border border-[#E8EDF3] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8EDF3]">
            <Lock className="w-4 h-4 text-[#4F46E5]" />
            <h3 className="text-sm font-bold text-[#172033]">Admin Credentials & Access</h3>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E8EDF3] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Admin Identifier:</span>
              <span className="font-mono font-semibold text-[#172033]">admin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Access Level:</span>
              <span className="font-semibold text-emerald-700">Super Administrator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Config Location:</span>
              <span className="font-mono text-[11px] text-[#64748B]">.env (ADMIN_ID, ADMIN_PASSWORD)</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
