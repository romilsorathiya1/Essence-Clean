import nodemailer from 'nodemailer';

// Create reusable transporter using Gmail SMTP
const createTransporter = () => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        console.error('EMAIL_USER or EMAIL_PASS environment variables are not set!');
        return null;
    }

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: emailUser,
            pass: emailPass,
        }
    });
};

/**
 * Send order confirmation email with PDF invoice attachment
 * @param {Object} order - The order object from database
 * @param {Buffer} pdfBuffer - The PDF invoice as a buffer
 * @returns {Promise<Object>} - Nodemailer send result
 */
export async function sendOrderConfirmation(order, pdfBuffer) {
    const transporter = createTransporter();

    if (!transporter) {
        throw new Error('Email transporter not configured - missing credentials');
    }

    const emailHtml = generateEmailTemplate(order);

    const mailOptions = {
        from: `"Essence Clean" <${process.env.EMAIL_USER}>`,
        to: order.customerEmail,
        subject: `Order Confirmed! Your Order #${order.orderNumber} - Essence Clean`,
        html: emailHtml,
        attachments: pdfBuffer ? [
            {
                filename: `Invoice-${order.orderNumber}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ] : [],
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully! Message ID:', result.messageId);
        return result;
    } catch (error) {
        console.error('Nodemailer error:', error.message);
        console.error('Full error:', error);
        throw error;
    }
}

/**
 * Generate professional HTML email template
 * @param {Object} order - The order object
 * @returns {string} - HTML email content
 */
function generateEmailTemplate(order) {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toLocaleString()}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
    `).join('');

    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track-order?order=${order.orderNumber}&email=${encodeURIComponent(order.customerEmail)}`;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Essence Clean</h1>
                            <p style="color: #c8a45a; margin: 10px 0 0 0; font-size: 14px;">Premium Natural Cleaning</p>
                        </td>
                    </tr>
                    
                
                    <!-- Success Icon & Message -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px; text-align: center;">
                            <center>
                                <table role="presentation" width="70" height="70" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px auto;">
                                    <tr>
                                        <td style="background-color: #22c55e; border-radius: 50%; width: 70px; height: 70px; text-align: center; vertical-align: middle;">
                                            <p style="margin: 0; padding: 0; color: #ffffff; font-size: 36px; line-height: 36px; display: inline-block;">✓</p>
                                        </td>
                                    </tr>
                                </table>
                            </center>
                            <h2 style="color: #1a472a; margin: 0 0 10px 0; font-size: 24px;">Order Placed Successfully!</h2>
                            <p style="color: #6b7280; margin: 0; font-size: 16px;">Thank you for your order, ${order.customerName}!</p>
                        </td>
                    </tr>

                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 0 30px;">
                            <table width="100%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Order Number</p>
                                        <p style="margin: 0; color: #1a472a; font-size: 18px; font-weight: bold;">${order.orderNumber}</p>
                                    </td>
                                    <td style="text-align: right;">
                                        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Tracking ID</p>
                                        <p style="margin: 0; color: #c8a45a; font-size: 18px; font-weight: bold;">${order.trackingId || 'Generating...'}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Order Items -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <h3 style="color: #1a472a; margin: 0 0 15px 0; font-size: 18px;">Order Summary</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                                <thead>
                                    <tr style="background-color: #f9fafb;">
                                        <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 600;">Item</th>
                                        <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 600;">Qty</th>
                                        <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600;">Price</th>
                                        <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Totals -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table width="100%" style="background-color: #f9fafb; border-radius: 8px; padding: 15px;">
                                <tr>
                                    <td style="padding: 5px 0; color: #6b7280;">Subtotal</td>
                                    <td style="padding: 5px 0; text-align: right; color: #374151;">₹${order.subtotal.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px 0; color: #6b7280;">Shipping</td>
                                    <td style="padding: 5px 0; text-align: right; color: ${order.shipping === 0 ? '#22c55e' : '#374151'};">
                                        ${order.shipping === 0 ? 'FREE' : '₹' + order.shipping}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0 5px 0; color: #1a472a; font-size: 18px; font-weight: bold; border-top: 2px solid #e5e7eb;">Total</td>
                                    <td style="padding: 10px 0 5px 0; text-align: right; color: #1a472a; font-size: 18px; font-weight: bold; border-top: 2px solid #e5e7eb;">₹${order.total.toLocaleString()}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Shipping Address -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <h3 style="color: #1a472a; margin: 0 0 10px 0; font-size: 18px;">Shipping Address</h3>
                            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
                                ${order.customerName}<br>
                                ${order.address}<br>
                                ${order.city}, ${order.state} - ${order.pincode}<br>
                                Phone: ${order.customerPhone}
                            </p>
                        </td>
                    </tr>

                    <!-- Track Order Button -->
                    <tr>
                        <td style="padding: 10px 30px 30px 30px; text-align: center;">
                            <a href="${trackingUrl}" style="display: inline-block; background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                📦 Track Your Order
                            </a>
                            
                            <p style="margin-top: 25px; margin-bottom: 10px; color: #6b7280; font-size: 14px;">Scan to Track</p>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingUrl)}" alt="Track Order QR Code" width="120" height="120" style="border: 2px solid #e5e7eb; padding: 5px; border-radius: 8px;">
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a472a; padding: 25px 30px; text-align: center;">
                            <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 14px;">
                                Questions? Reply to this email or contact us at <a href="mailto:support@essenceclean.com" style="color: #c8a45a; text-decoration: none; font-weight: bold;">support@essenceclean.com</a>
                            </p>
                            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                                © ${new Date().getFullYear()} Essence Clean. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

export default { sendOrderConfirmation };
