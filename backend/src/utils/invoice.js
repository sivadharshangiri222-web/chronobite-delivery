import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = async (order, payment, user, restaurant, slot) => {
  return new Promise((resolve, reject) => {
    try {
      const invoicesDir = path.join(__dirname, '../../invoices');
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const invoiceFileName = `INV-${order._id}.pdf`;
      const filePath = path.join(invoicesDir, invoiceFileName);

      const doc = new PDFDocument({ margin: 40 });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Header Branding
      doc.fillColor('#E8192C').fontSize(24).text('ChronoBite', { align: 'left' });
      doc.fillColor('#5A5A5A').fontSize(10).text('Premium Food Delivery Platform', { align: 'left' });
      doc.moveDown(1);

      // Invoice metadata
      doc.fillColor('#0D0D0D').fontSize(16).text('TAX INVOICE', { align: 'right' });
      doc.fontSize(10).text(`Invoice No: INV-${order._id.toString().substring(0, 8).toUpperCase()}`, { align: 'right' });
      doc.text(`Date: ${new Date(payment.createdAt || Date.now()).toLocaleDateString()}`, { align: 'right' });
      doc.text(`Razorpay ID: ${payment.razorpayPaymentId || 'N/A'}`, { align: 'right' });
      doc.moveDown(1.5);

      // Customer & Restaurant Info
      doc.fillColor('#0D0D0D').fontSize(12).text('Billed To:', 40, doc.y, { underline: true });
      doc.fontSize(10).text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Phone: ${user.phone}`);
      doc.text(`Delivery Address: ${order.deliveryAddress.street}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}`);
      
      doc.moveDown(1);
      doc.fontSize(12).text('Restaurant:', { underline: true });
      doc.fontSize(10).text(`Name: ${restaurant.name}`);
      doc.text(`Address: ${restaurant.address.street}, ${restaurant.address.city}`);
      doc.text(`Delivery Slot: ${slot ? `${slot.date} (${slot.startTime} - ${slot.endTime})` : 'Standard'}`);
      doc.moveDown(1.5);

      // Items Table Header
      const tableTop = doc.y;
      doc.fillColor('#1A1A1A').rect(40, tableTop, 515, 20).fill();
      doc.fillColor('#FFFFFF').fontSize(10).text('Item', 50, tableTop + 5);
      doc.text('Qty', 300, tableTop + 5);
      doc.text('Unit Price (₹)', 370, tableTop + 5);
      doc.text('Subtotal (₹)', 470, tableTop + 5);

      let currentY = tableTop + 25;
      let itemsSubtotal = 0;

      order.items.forEach((item) => {
        const itemSubtotal = item.price * item.quantity;
        itemsSubtotal += itemSubtotal;

        doc.fillColor('#0D0D0D').fontSize(10).text(item.name, 50, currentY);
        doc.text(item.quantity.toString(), 300, currentY);
        doc.text(item.price.toFixed(2), 370, currentY);
        doc.text(itemSubtotal.toFixed(2), 470, currentY);

        currentY += 20;
      });

      doc.moveDown(1);
      const gst = itemsSubtotal * 0.05; // 5% GST
      const grandTotal = itemsSubtotal + gst;

      doc.moveTo(40, currentY).lineTo(555, currentY).stroke('#E0E0E0');
      currentY += 10;

      doc.fontSize(10).text('Subtotal:', 370, currentY);
      doc.text(`₹${itemsSubtotal.toFixed(2)}`, 470, currentY);
      currentY += 15;

      doc.text('GST (5%):', 370, currentY);
      doc.text(`₹${gst.toFixed(2)}`, 470, currentY);
      currentY += 15;

      doc.fillColor('#E8192C').fontSize(12).text('Total Paid:', 370, currentY);
      doc.text(`₹${grandTotal.toFixed(2)}`, 470, currentY);

      currentY += 40;
      doc.fillColor('#5A5A5A').fontSize(10).text('Thank you for ordering with ChronoBite!', 40, currentY, { align: 'center' });

      doc.end();

      writeStream.on('finish', () => {
        resolve(`/invoices/${invoiceFileName}`);
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};
