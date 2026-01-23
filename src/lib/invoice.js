import { PDFDocument, rgb, StandardFonts, PDFOperator, PDFNumber } from 'pdf-lib';
import QRCode from 'qrcode';

// Brand colors (converted to 0-1 range for pdf-lib)
const BRAND_GREEN = rgb(10 / 255, 61 / 255, 46 / 255);       // #0A3D2E
const BRAND_GOLD = rgb(197 / 255, 160 / 255, 89 / 255);      // #C5A059
const GRAY_50 = rgb(249 / 255, 250 / 255, 251 / 255);        // #F9FAFB
const GRAY_300 = rgb(209 / 255, 213 / 255, 219 / 255);       // #D1D5DB
const GRAY_500 = rgb(107 / 255, 114 / 255, 128 / 255);       // #6B7280
const GRAY_900 = rgb(17 / 255, 24 / 255, 39 / 255);          // #111827
const GREEN_600 = rgb(22 / 255, 163 / 255, 74 / 255);        // #16A34A
const WHITE = rgb(1, 1, 1);

/**
 * Generate a Premium PDF Invoice using pdf-lib.
 * Works on serverless environments like Vercel.
 */
export async function generateInvoicePDF(order) {
  try {
    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

    // Embed standard fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    const margin = 40;

    // Generate QR Code
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track-order?order=${order.orderNumber}&email=${encodeURIComponent(order.customerEmail)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl, { width: 100, margin: 1 });
    const qrCodeBytes = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrCodeBytes);

    // Format helpers
    const formatPrice = (amount) => 'Rs. ' + (amount || 0).toLocaleString('en-IN');
    const date = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const paymentMethod = (order.paymentMethod || 'COD').toUpperCase();

    // ============ HEADER ============
    // Dark green background
    page.drawRectangle({
      x: 0,
      y: height - 90,
      width: width,
      height: 90,
      color: BRAND_GREEN,
    });

    // Gold accent line
    page.drawRectangle({
      x: 0,
      y: height - 93,
      width: width,
      height: 3,
      color: BRAND_GOLD,
    });

    // Logo text
    const brandText = 'Essence Clean';
    const brandSize = 24;
    page.drawText(brandText, {
      x: margin,
      y: height - 45,
      size: brandSize,
      font: helveticaBold,
      color: WHITE,
    });

    // Slogan with justified spacing
    const sloganText = 'PREMIUM NATURAL CARE';
    const sloganSize = 8;
    const brandWidth = helveticaBold.widthOfTextAtSize(brandText, brandSize);
    const sloganWidth = helveticaBold.widthOfTextAtSize(sloganText, sloganSize);
    const charSpacing = (brandWidth - sloganWidth) / (sloganText.length - 1);

    page.pushOperators(PDFOperator.of('Tc', [PDFNumber.of(charSpacing)]));
    page.drawText(sloganText, {
      x: margin,
      y: height - 60,
      size: sloganSize,
      font: helveticaBold,
      color: BRAND_GOLD,
    });
    page.pushOperators(PDFOperator.of('Tc', [PDFNumber.of(0)]));

    // TAX INVOICE text (right side)
    page.drawText('TAX INVOICE', {
      x: width - margin - 100,
      y: height - 45,
      size: 18,
      font: helveticaBold,
      color: WHITE,
    });

    page.drawText(`#${order.orderNumber}`, {
      x: width - margin - 100,
      y: height - 62,
      size: 10,
      font: helvetica,
      color: rgb(156 / 255, 163 / 255, 175 / 255),
    });

    // ============ BILLED TO & INVOICE DETAILS ============
    let yPos = height - 130;

    // BILLED TO label
    page.drawText('BILLED TO', {
      x: margin,
      y: yPos,
      size: 9,
      font: helveticaBold,
      color: GRAY_500,
    });

    // Gold left border for billing info
    page.drawRectangle({
      x: margin,
      y: yPos - 75,
      width: 3,
      height: 70,
      color: BRAND_GOLD,
    });

    // Customer info
    page.drawText(order.customerName, {
      x: margin + 12,
      y: yPos - 20,
      size: 14,
      font: helveticaBold,
      color: GRAY_900,
    });

    page.drawText(order.address, {
      x: margin + 12,
      y: yPos - 38,
      size: 10,
      font: helvetica,
      color: GRAY_500,
    });

    page.drawText(`${order.city}, ${order.state} - ${order.pincode}`, {
      x: margin + 12,
      y: yPos - 52,
      size: 10,
      font: helvetica,
      color: GRAY_500,
    });

    page.drawText(`Phone: ${order.customerPhone}`, {
      x: margin + 12,
      y: yPos - 66,
      size: 10,
      font: helvetica,
      color: GRAY_500,
    });

    // INVOICE DETAILS box (right side)
    const detailsBoxX = width - margin - 180;
    const detailsBoxWidth = 180;

    page.drawText('INVOICE DETAILS', {
      x: detailsBoxX + 60,
      y: yPos,
      size: 9,
      font: helveticaBold,
      color: GRAY_500,
    });

    // Details box background
    page.drawRectangle({
      x: detailsBoxX,
      y: yPos - 90,
      width: detailsBoxWidth,
      height: 75,
      color: GRAY_50,
    });

    // Details content
    const detailsStartY = yPos - 28;

    // Date Issued
    page.drawText('Date Issued', {
      x: detailsBoxX + 12,
      y: detailsStartY,
      size: 9,
      font: helvetica,
      color: GRAY_500,
    });
    page.drawText(date, {
      x: detailsBoxX + detailsBoxWidth - 12 - helveticaBold.widthOfTextAtSize(date, 10),
      y: detailsStartY,
      size: 10,
      font: helveticaBold,
      color: GRAY_900,
    });

    // Payment
    page.drawText('Payment', {
      x: detailsBoxX + 12,
      y: detailsStartY - 22,
      size: 9,
      font: helvetica,
      color: GRAY_500,
    });
    page.drawText(paymentMethod, {
      x: detailsBoxX + detailsBoxWidth - 12 - helveticaBold.widthOfTextAtSize(paymentMethod, 10),
      y: detailsStartY - 22,
      size: 10,
      font: helveticaBold,
      color: GRAY_900,
    });

    // Tracking ID
    const trackingId = order.trackingId || 'Pending';
    page.drawText('Tracking ID', {
      x: detailsBoxX + 12,
      y: detailsStartY - 44,
      size: 9,
      font: helvetica,
      color: GRAY_500,
    });
    page.drawText(trackingId, {
      x: detailsBoxX + detailsBoxWidth - 12 - helveticaBold.widthOfTextAtSize(trackingId, 9),
      y: detailsStartY - 44,
      size: 9,
      font: helveticaBold,
      color: BRAND_GOLD,
    });

    // ============ ITEMS TABLE ============
    yPos = height - 250;

    const tableWidth = width - (margin * 2);
    const rowHeight = 30;

    // Table header background
    page.drawRectangle({
      x: margin,
      y: yPos - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: BRAND_GREEN,
    });

    // Column positions
    const col1X = margin + 10;
    const col2X = margin + 280;
    const col3X = margin + 370;
    const col4X = margin + 450;

    // Header text
    page.drawText('ITEM DESCRIPTION', {
      x: col1X,
      y: yPos - 20,
      size: 8,
      font: helveticaBold,
      color: WHITE,
    });
    page.drawText('UNIT PRICE', {
      x: col2X,
      y: yPos - 20,
      size: 8,
      font: helveticaBold,
      color: WHITE,
    });
    page.drawText('QTY', {
      x: col3X + 10,
      y: yPos - 20,
      size: 8,
      font: helveticaBold,
      color: WHITE,
    });
    page.drawText('TOTAL', {
      x: col4X + 20,
      y: yPos - 20,
      size: 8,
      font: helveticaBold,
      color: WHITE,
    });

    yPos -= rowHeight;

    // Table rows
    order.items.forEach((item, index) => {
      const rowY = yPos - (index + 1) * rowHeight;

      // Alternating row background
      if (index % 2 === 0) {
        page.drawRectangle({
          x: margin,
          y: rowY,
          width: tableWidth,
          height: rowHeight,
          color: GRAY_50,
        });
      }

      // Row bottom border
      page.drawRectangle({
        x: margin,
        y: rowY,
        width: tableWidth,
        height: 1,
        color: rgb(229 / 255, 231 / 255, 235 / 255),
      });

      // Item name
      page.drawText(item.name, {
        x: col1X,
        y: rowY + 10,
        size: 10,
        font: helvetica,
        color: GRAY_900,
      });

      // Unit price
      const priceText = formatPrice(item.price);
      page.drawText(priceText, {
        x: col2X,
        y: rowY + 10,
        size: 10,
        font: helvetica,
        color: GRAY_500,
      });

      // Quantity
      page.drawText(item.quantity.toString(), {
        x: col3X + 15,
        y: rowY + 10,
        size: 10,
        font: helvetica,
        color: GRAY_500,
      });

      // Total
      const totalText = formatPrice(item.price * item.quantity);
      page.drawText(totalText, {
        x: col4X + 10,
        y: rowY + 10,
        size: 10,
        font: helveticaBold,
        color: GRAY_900,
      });
    });

    // Table border
    const tableEndY = yPos - (order.items.length * rowHeight);
    page.drawRectangle({
      x: margin,
      y: tableEndY,
      width: tableWidth,
      height: yPos - tableEndY + rowHeight,
      borderColor: rgb(229 / 255, 231 / 255, 235 / 255),
      borderWidth: 1,
    });

    // ============ TOTALS SECTION ============
    yPos = tableEndY - 30;
    const totalsX = width - margin - 180;

    // Subtotal
    page.drawText('Subtotal', {
      x: totalsX,
      y: yPos,
      size: 10,
      font: helvetica,
      color: GRAY_500,
    });
    const subtotalText = formatPrice(order.subtotal);
    page.drawText(subtotalText, {
      x: width - margin - helvetica.widthOfTextAtSize(subtotalText, 10),
      y: yPos,
      size: 10,
      font: helvetica,
      color: GRAY_900,
    });

    yPos -= 22;

    // Shipping
    page.drawText('Shipping', {
      x: totalsX,
      y: yPos,
      size: 10,
      font: helvetica,
      color: GRAY_500,
    });
    const shippingText = order.shipping === 0 ? 'FREE' : formatPrice(order.shipping);
    const shippingColor = order.shipping === 0 ? GREEN_600 : GRAY_900;
    page.drawText(shippingText, {
      x: width - margin - helveticaBold.widthOfTextAtSize(shippingText, 10),
      y: yPos,
      size: 10,
      font: helveticaBold,
      color: shippingColor,
    });

    yPos -= 30;

    // Total line
    page.drawRectangle({
      x: totalsX,
      y: yPos + 18,
      width: 180,
      height: 2,
      color: BRAND_GREEN,
    });

    // Total Due
    page.drawText('Total Due', {
      x: totalsX,
      y: yPos,
      size: 12,
      font: helveticaBold,
      color: BRAND_GREEN,
    });
    const totalText = formatPrice(order.total);
    page.drawText(totalText, {
      x: width - margin - helveticaBold.widthOfTextAtSize(totalText, 14),
      y: yPos - 2,
      size: 14,
      font: helveticaBold,
      color: BRAND_GREEN,
    });

    // ============ TRACK YOUR ORDER SECTION ============
    yPos -= 70;
    const trackBoxHeight = 90;

    // Gray background box
    page.drawRectangle({
      x: margin,
      y: yPos - trackBoxHeight,
      width: tableWidth,
      height: trackBoxHeight,
      color: GRAY_50,
      borderColor: GRAY_300,
      borderWidth: 1,
    });

    // Track Your Order text
    page.drawText('Track Your Order', {
      x: margin + 20,
      y: yPos - 25,
      size: 14,
      font: helveticaBold,
      color: BRAND_GREEN,
    });

    page.drawText('Scan the QR code to view live shipping updates or click', {
      x: margin + 20,
      y: yPos - 45,
      size: 9,
      font: helvetica,
      color: GRAY_500,
    });

    page.drawText('the tracking link in your email.', {
      x: margin + 20,
      y: yPos - 57,
      size: 9,
      font: helvetica,
      color: GRAY_500,
    });

    page.drawText(`Order ID: ${order.orderNumber}`, {
      x: margin + 20,
      y: yPos - 75,
      size: 8,
      font: helvetica,
      color: GRAY_500,
    });

    // QR Code
    const qrSize = 60;
    const qrX = width - margin - qrSize - 25;
    const qrY = yPos - trackBoxHeight + 15;

    // White background for QR
    page.drawRectangle({
      x: qrX - 5,
      y: qrY - 5,
      width: qrSize + 10,
      height: qrSize + 10,
      color: WHITE,
      borderColor: GRAY_300,
      borderWidth: 1,
    });

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    });

    // ============ FOOTER ============
    const footerY = 50;

    // Top border line
    page.drawRectangle({
      x: 0,
      y: footerY + 20,
      width: width,
      height: 1,
      color: rgb(229 / 255, 231 / 255, 235 / 255),
    });

    // Footer text
    const footerText1 = 'Thank you for choosing Essence Clean. Contact us at ';
    const emailText = 'support@essenceclean.com';

    page.drawText(footerText1, {
      x: (width - helvetica.widthOfTextAtSize(footerText1 + emailText, 9)) / 2,
      y: footerY,
      size: 9,
      font: helvetica,
      color: GRAY_500,
    });

    page.drawText(emailText, {
      x: (width - helvetica.widthOfTextAtSize(footerText1 + emailText, 9)) / 2 + helvetica.widthOfTextAtSize(footerText1, 9),
      y: footerY,
      size: 9,
      font: helveticaBold,
      color: BRAND_GREEN,
    });

    const disclaimerText = 'This is a computer-generated invoice. No signature required.';
    page.drawText(disclaimerText, {
      x: (width - helvetica.widthOfTextAtSize(disclaimerText, 7)) / 2,
      y: footerY - 15,
      size: 7,
      font: helvetica,
      color: GRAY_500,
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);

  } catch (error) {
    console.error('PDF-lib Invoice Generation Error:', error);
    throw error;
  }
}
