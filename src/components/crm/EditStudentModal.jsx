import { useState } from 'react';
import { X, Save } from 'lucide-react';

export default function EditStudentModal({ student, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    studentName: student?.student_name || '',
    program: student?.program || 'Montessori Early Years',
    parentName: student?.parent_name || '',
    parentPhone: student?.parent_phone || '',
    parentEmail: student?.parent_email || '',
    address: student?.address || '',
    amount: student?.amount || '',
    validityEnd: student?.validity_end ? new Date(student.validity_end).toISOString().slice(0, 10) : '',
  });

  if (!student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(student.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#E8EDF3] max-w-lg w-full shadow-2xl p-6 relative text-[#172033]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-[#172033] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold text-[#172033] pb-3 border-b border-[#E8EDF3]">
          Edit Student Record
        </h3>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Student Full Name
              </label>
              <input
                type="text"
                required
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Program / Course
              </label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              >
                <option value="Montessori Early Years">Montessori Early Years</option>
                <option value="Abacus Mental Math">Abacus Mental Math</option>
                <option value="Academic Tuition">Academic Tuition</option>
                <option value="Handwriting & Motor Skills">Handwriting & Motor Skills</option>
                <option value="Early Phonics & Language">Early Phonics & Language</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                required
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Parent WhatsApp Mobile
              </label>
              <input
                type="tel"
                required
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs font-mono text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Monthly Fee (₹)
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs font-bold text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Validity Expiry Date
              </label>
              <input
                type="date"
                required
                value={formData.validityEnd}
                onChange={(e) => setFormData({ ...formData, validityEnd: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#172033] mb-1">
              Address / Notes
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#E8EDF3] bg-white text-xs text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>

          <div className="pt-3 border-t border-[#E8EDF3] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-[#E8EDF3] hover:bg-slate-50 text-xs font-medium text-[#64748B] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
