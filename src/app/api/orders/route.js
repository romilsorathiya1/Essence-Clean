import { NextResponse } from 'next/server';
import { getAll, create } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sendOrderConfirmation } from '@/lib/email';
import { generateInvoicePDF } from '@/lib/invoice';
// invoice import removed

// GET /api/orders - Get all orders (admin only)
export async function GET() {
    try {
        // Check authentication
        const { authorized } = await requireAuth();
        if (!authorized) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const orders = await getAll('orders');
        // Sort by date, newest first
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return NextResponse.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create new order (public)
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'address', 'items'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Validate items array
        if (!Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Order must have at least one item' },
                { status: 400 }
            );
        }

        // Calculate total
        const total = body.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Generate order number
        const orderNumber = `EC${Date.now().toString(36).toUpperCase()}`;

        // Generate tracking ID
        const trackingId = `TRACK-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Create order
        const newOrder = await create('orders', {
            orderNumber,
            trackingId,
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            customerPhone: body.customerPhone,
            address: body.address,
            city: body.city || '',
            state: body.state || '',
            pincode: body.pincode || '',
            items: body.items,
            subtotal: total,
            shipping: body.shipping || 0,
            total: total + (body.shipping || 0),
            status: 'pending',
            paymentMethod: body.paymentMethod || 'cod',
            paymentStatus: 'pending',
            notes: body.notes || ''
        });

        // Send order confirmation email (async)
        try {
            const pdfBuffer = await generateInvoicePDF(newOrder);
            await sendOrderConfirmation(newOrder, pdfBuffer);
            console.log(`Order confirmation email sent for order ${orderNumber}`);
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
        }

        return NextResponse.json({
            success: true,
            data: newOrder,
            message: `Order ${orderNumber} placed successfully`
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

