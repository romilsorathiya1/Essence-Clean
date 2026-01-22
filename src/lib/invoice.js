import puppeteer from 'puppeteer';

/**
 * Generate a Premium PDF Invoice using Puppeteer.
 * Renders a high-quality HTML template to PDF.
 */
export async function generateInvoicePDF(order) {
  let browser = null;
  try {
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Generate HTML content
    const html = getInvoiceHTML(order);

    // Set content and wait for fonts/images
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px'
      }
    });

    return pdfBuffer;

  } catch (error) {
    console.error('Puppeteer Invoice Generation Error:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Generates the HTML string for the invoice.
 */
function getInvoiceHTML(order) {
  const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track-order?order=${order.orderNumber}&email=${encodeURIComponent(order.customerEmail)}`;
  const date = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const paymentMethod = (order.paymentMethod || 'COD').toUpperCase();

  // Format currency
  const formatPrice = (amount) => '₹' + (amount || 0).toLocaleString('en-IN');

  // Render items rows
  const itemsRows = order.items.map((item, index) => `
    <tr class="${index % 2 === 0 ? 'bg-gray-50' : ''}">
      <td class="py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs truncate">
        ${item.name}
      </td>
      <td class="px-3 py-3 text-sm text-right text-gray-500">
        ${formatPrice(item.price)}
      </td>
      <td class="px-3 py-3 text-sm text-center text-gray-500">
        ${item.quantity}
      </td>
      <td class="px-3 py-3 text-sm text-right text-gray-900 font-bold pr-6">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice #${order.orderNumber}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { margin: 0; }
    body { 
      font-family: 'Inter', sans-serif; 
      -webkit-print-color-adjust: exact; 
      print-color-adjust: exact;
    }
    .font-serif { font-family: 'Playfair Display', serif; }
    .bg-brand { background-color: #0A3D2E; }
    .text-brand { color: #0A3D2E; }
    .bg-gold { background-color: #C5A059; }
    .text-gold { color: #C5A059; }
    .page-container {
      width: 210mm;
      min-height: 297mm;
      padding: 0;
      margin: 0 auto;
      background: white;
      position: relative;
    }
    .content-wrap {
      padding: 40px;
    }
    /* Ensure content fits on one page if possible */
    .compact-table td { padding-top: 8px; padding-bottom: 8px; }
  </style>
</head>
<body class="bg-white">
  <div class="page-container">
    <!-- Header -->
    <div class="bg-brand text-white h-32 relative overflow-hidden">
      <div class="absolute bottom-0 left-0 w-full h-1 bg-gold"></div>
      <div class="h-full flex items-center justify-between px-10">
        <div>
          <h1 class="font-serif text-3xl font-bold tracking-wide">Essence Clean</h1>
          <p class="text-gold text-xs font-bold tracking-[0.2em] mt-1 uppercase">Premium Natural Care</p>
        </div>
        <div class="text-right">
          <h2 class="text-2xl font-bold tracking-tight">TAX INVOICE</h2>
          <p class="text-gray-300 text-sm mt-1">#${order.orderNumber}</p>
        </div>
      </div>
    </div>

    <div class="content-wrap">
      <!-- Info Grid -->
      <div class="flex justify-between mb-8 gap-8">
        <!-- Billed To -->
        <div class="flex-1">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Billed To</h3>
          <div class="text-gray-900 border-l-4 border-gold pl-4">
            <p class="font-bold text-lg">${order.customerName}</p>
            <p class="text-sm text-gray-600 mt-1 whitespace-pre-line leading-relaxed">${order.address}</p>
            <p class="text-sm text-gray-600 mt-1">${order.city}, ${order.state} - ${order.pincode}</p>
            <p class="text-sm text-gray-600 mt-1">Phone: ${order.customerPhone}</p>
          </div>
        </div>

        <!-- Invoice Details -->
        <div class="w-64">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-right">Invoice Details</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between mb-2">
              <span class="text-xs text-gray-500">Date Issued</span>
              <span class="text-sm font-bold text-gray-900">${date}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-xs text-gray-500">Payment</span>
              <span class="text-sm font-bold text-gray-900">${paymentMethod}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-500">Tracking ID</span>
              <span class="text-sm font-bold text-gold">${order.trackingId || 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="mb-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg border border-gray-100">
        <table class="min-w-full divide-y divide-gray-300 compact-table">
          <thead class="bg-brand">
            <tr>
              <th scope="col" class="py-3 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-white sm:pl-6">Item Description</th>
              <th scope="col" class="px-3 py-3 text-right text-xs font-bold uppercase tracking-wide text-white">Unit Price</th>
              <th scope="col" class="px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-white">Qty</th>
              <th scope="col" class="px-3 py-3 text-right text-xs font-bold uppercase tracking-wide text-white pr-6">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            ${itemsRows}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="flex justify-end mb-10">
        <div class="w-80">
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-500 text-sm">Subtotal</span>
            <span class="text-gray-900 font-medium">${formatPrice(order.subtotal)}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-500 text-sm">Shipping</span>
            <span class="text-gray-900 font-medium ${order.shipping === 0 ? 'text-green-600' : ''}">
              ${order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
            </span>
          </div>
          <div class="flex justify-between py-3 border-b-2 border-brand mt-1">
            <span class="text-brand font-bold text-lg">Total Due</span>
            <span class="text-brand font-bold text-xl">${formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <!-- Tracking Section (Sticks to bottom of content, or flexible) -->
      <div class="bg-gray-50 rounded-xl border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h4 class="font-bold text-brand text-lg">Track Your Order</h4>
          <p class="text-sm text-gray-600 mt-1 max-w-sm">
            Scan the QR code to view live shipping updates or click the tracking link in your email.
          </p>
          <div class="mt-3 text-xs text-gray-400">Order ID: ${order.orderNumber}</div>
        </div>
        <div class="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingUrl)}" 
               alt="QR" class="w-20 h-20 object-contain">
        </div>
      </div>
    </div>

    <!-- Footer Page Bottom -->
    <div class="absolute bottom-0 w-full border-t border-gray-100 py-6 text-center">
      <p class="text-gray-500 text-xs text-center">
        Thank you for choosing Essence Clean. Contact us at <strong class="text-brand">support@essenceclean.com</strong>
      </p>
      <p class="text-gray-400 text-[10px] mt-1">
        This is a computer-generated invoice. No signature required.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
