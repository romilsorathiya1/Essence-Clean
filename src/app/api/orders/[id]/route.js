import { NextResponse } from 'next/server';
import { getById, update } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/orders/[id] - Get single order (admin only)
export async function GET(request, { params }) {
    try {
        // Check authentication
        const { authorized } = await requireAuth();
        if (!authorized) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const order = await getById('orders', id);

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PUT /api/orders/[id] - Update order (admin only)
export async function PUT(request, { params }) {
    try {
        // Check authentication
        const { authorized } = await requireAuth();
        if (!authorized) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        // Check if order exists
        const existing = await getById('orders', id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Validate status if provided
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (body.status && !validStatuses.includes(body.status)) {
            return NextResponse.json(
                { success: false, error: 'Invalid status' },
                { status: 400 }
            );
        }

        // Update order
        const updatedOrder = await update('orders', id, {
            status: body.status ?? existing.status,
            paymentStatus: body.paymentStatus ?? existing.paymentStatus,
            trackingNumber: body.trackingNumber ?? existing.trackingNumber,
            notes: body.notes ?? existing.notes
        });

        return NextResponse.json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
