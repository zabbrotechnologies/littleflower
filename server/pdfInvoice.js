import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGO_PATH = path.join(__dirname, '../public/logo.png');

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatINR(val) {
  const num = Number(val || 0);
  return `Rs. ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Generates a commercial-grade A4 PDF admission & fee receipt buffer.
 */
export function generateAdmissionPdfBuffer(admission) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 48 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const contentWidth = pageWidth - 96;

      // Top Indigo Accent Bar
      doc.rect(0, 0, pageWidth, 8).fill('#4F46E5');

      // Header Section: Logo + Academy Branding
      let headerY = 40;
      if (fs.existsSync(LOGO_PATH)) {
        doc.image(LOGO_PATH, 48, headerY, { width: 48, height: 48, fit: [48, 48] });
      }

      const brandX = fs.existsSync(LOGO_PATH) ? 108 : 48;
      doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#172033')
        .text('LITTLE FLOWERS ACADEMY', brandX, headerY + 2);

      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor('#64748B')
        .text('Montessori, Abacus & Academic Excellence Center', brandX, headerY + 24)
        .text('Support: +91 94422 66789  |  littleflowersacademy.site', brandX, headerY + 37);

      // Right Side: Receipt Title + PAID Pill
      doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor('#4F46E5')
        .text('OFFICIAL FEE RECEIPT', 48, headerY + 2, { align: 'right', width: contentWidth });

      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor('#172033')
        .text(`Receipt No: ${admission.receipt_no}`, 48, headerY + 21, { align: 'right', width: contentWidth })
        .text(`Date: ${formatDate(admission.payment_date)}`, 48, headerY + 35, { align: 'right', width: contentWidth });

      // PAID Badge
      doc.roundedRect(pageWidth - 108, headerY + 52, 60, 18, 4).fill('#DCFCE7');
      doc
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .fillColor('#166534')
        .text('PAID', pageWidth - 108, headerY + 56.5, { width: 60, align: 'center' });

      // Divider
      const divY = 122;
      doc.moveTo(48, divY).lineTo(pageWidth - 48, divY).lineWidth(1).strokeColor('#E8EDF3').stroke();

      // Student & Parent Info Cards (Two Columns)
      const cardY = 140;
      const colW = (contentWidth - 16) / 2;

      // Left Card: Student Details
      doc.roundedRect(48, cardY, colW, 112, 6).fillAndStroke('#F8FAFC', '#E8EDF3');
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#4F46E5')
        .text('STUDENT INFORMATION', 62, cardY + 14);

      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#172033')
        .text(admission.student_name || '—', 62, cardY + 32, { width: colW - 28 });

      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor('#475569')
        .text(`Program: ${admission.program || '—'}`, 62, cardY + 52, { width: colW - 28 })
        .text(`Learning Mode: ${admission.learning_mode || 'In-Person'}`, 62, cardY + 68, { width: colW - 28 })
        .text(`Duration: ${admission.course_duration || '1 Month'}`, 62, cardY + 84, { width: colW - 28 });

      // Right Card: Parent & Contact Details
      const rightX = 48 + colW + 16;
      doc.roundedRect(rightX, cardY, colW, 112, 6).fillAndStroke('#F8FAFC', '#E8EDF3');
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#4F46E5')
        .text('PARENT / GUARDIAN', rightX + 14, cardY + 14);

      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#172033')
        .text(admission.parent_name || '—', rightX + 14, cardY + 32, { width: colW - 28 });

      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor('#475569')
        .text(`WhatsApp: ${admission.parent_phone || '—'}`, rightX + 14, cardY + 52, { width: colW - 28 })
        .text(`Email: ${admission.parent_email || '—'}`, rightX + 14, cardY + 68, { width: colW - 28 })
        .text(`Payment Mode: ${admission.payment_mode || 'UPI'}`, rightX + 14, cardY + 84, { width: colW - 28 });

      // Course Validity Banner
      const valY = 270;
      doc.roundedRect(48, valY, contentWidth, 40, 6).fillAndStroke('#EEF2FF', '#C7D2FE');
      doc
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .fillColor('#3730A3')
        .text(
          `Enrollment Validity:  ${formatDate(admission.validity_start)}  to  ${formatDate(admission.validity_end)}`,
          62,
          valY + 14,
          { width: contentWidth - 28 }
        );

      // Fee Breakdown Table
      const tableY = 330;
      doc.rect(48, tableY, contentWidth, 28).fill('#172033');
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#FFFFFF')
        .text('DESCRIPTION', 62, tableY + 9)
        .text('AMOUNT', 48, tableY + 9, { width: contentWidth - 14, align: 'right' });

      const admFee = Number(admission.admission_fee || 0);
      const monFee = Number(admission.monthly_fee || admission.amount || 0);
      const discount = Number(admission.discount || 0);
      const amountPaid = Number(admission.amount || 0);

      const rows = [
        { label: `Course Tuition Fee (${admission.program})`, value: formatINR(monFee) },
      ];
      if (admFee > 0) rows.push({ label: 'Admission / Registration Fee', value: formatINR(admFee) });
      if (discount > 0) rows.push({ label: 'Scholarship / Discount Applied', value: `- ${formatINR(discount)}` });

      let rowY = tableY + 28;
      rows.forEach((row, idx) => {
        const bg = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
        doc.rect(48, rowY, contentWidth, 30).fillAndStroke(bg, '#E8EDF3');
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#172033')
          .text(row.label, 62, rowY + 9)
          .text(row.value, 48, rowY + 9, { width: contentWidth - 14, align: 'right' });
        rowY += 30;
      });

      // Total Paid Row
      doc.rect(48, rowY, contentWidth, 36).fillAndStroke('#F1F5F9', '#CBD5E1');
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .fillColor('#172033')
        .text('TOTAL AMOUNT PAID', 62, rowY + 11)
        .fillColor('#4F46E5')
        .text(formatINR(amountPaid), 48, rowY + 11, { width: contentWidth - 14, align: 'right' });

      // Authorized Signatory & Footer
      const sigY = rowY + 75;
      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#64748B')
        .text('This is a computer-generated official receipt from Little Flowers Academy.', 48, sigY)
        .text('No physical signature is required.', 48, sigY + 14);

      doc
        .moveTo(pageWidth - 200, sigY + 12)
        .lineTo(pageWidth - 48, sigY + 12)
        .lineWidth(0.8)
        .strokeColor('#CBD5E1')
        .stroke();

      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#172033')
        .text('Authorized Signatory', pageWidth - 200, sigY + 18, { width: 152, align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
