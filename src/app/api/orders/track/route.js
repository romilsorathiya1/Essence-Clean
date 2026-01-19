import { NextResponse } from 'next/server';
import { getAll } from '@/lib/db';

// POST /api/orders/track - Track order by order number and email (public)
export async function POST(request) {
    try {
        const body = await request.json();
        const { orderNumber, email } = body;

        // Validate required fields
        if (!orderNumber || !email) {
            return NextResponse.json(
                { success: false, error: 'Order number and email are required' },
                { status: 400 }
            );
        }

        // Find order matching both order number and email
        const orders = getAll('orders');
        const order = orders.find(
            o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() &&
                o.customerEmail.toLowerCase() === email.toLowerCase()
        );

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'No order found with this order number and email combination' },
                { status: 404 }
            );
        }

        // Return order details (excluding sensitive admin info)
        const orderDetails = {
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            items: order.items,
            subtotal: order.subtotal,
            shipping: order.shipping,
            total: order.total,
            address: order.address,
            city: order.city,
            state: order.state,
            pincode: order.pincode,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };

        return NextResponse.json({
            success: true,
            data: orderDetails
        });
    } catch (error) {
        console.error('Error tracking order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to track order' },
            { status: 500 }
        );
    }
}
