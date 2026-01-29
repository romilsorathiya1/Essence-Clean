import { NextResponse } from 'next/server';
import { getAll, create, find } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sendOrderConfirmation } from '@/lib/email';
import { generateInvoicePDF } from '@/lib/invoice';
// invoice import removed

// GET /api/orders - Get all orders (admin only)
export async function GET(request) {
    try {
        // Check authentication
        const { authorized } = await requireAuth();
        if (!authorized) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const status = searchParams.get('status');

        const query = {};

        if (search) {
            query.orderNumber = { $regex: search, $options: 'i' };
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                // Set end date to end of day
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const orders = await find('orders', query);
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

