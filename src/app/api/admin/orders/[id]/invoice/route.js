import { NextResponse } from 'next/server';
import { getById } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { generateInvoicePDF } from '@/lib/invoice';

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

        const pdfBuffer = await generateInvoicePDF(order);

        // Return PDF
        const response = new NextResponse(pdfBuffer);
        response.headers.set('Content-Type', 'application/pdf');
        response.headers.set(
            'Content-Disposition',
            `attachment; filename="invoice-${order.orderNumber}.pdf"`
        );

        return response;

    } catch (error) {
        console.error('Error generating invoice:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate invoice' },
            { status: 500 }
        );
    }
}
