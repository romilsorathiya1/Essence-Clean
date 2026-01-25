import { NextResponse } from 'next/server';
import { find } from '@/lib/db';
import { generateInvoicePDF } from '@/lib/invoice';

export async function GET(request, { params }) {
    try {
        const { id } = await params; // using 'id' because the folder is [id]

        // Find order by orderNumber
        // We use the URL param 'id' as the orderNumber
        const orders = await find('orders', { orderNumber: id });
        const order = orders && orders.length > 0 ? orders[0] : null;

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            );
        }

        // Generate PDF
        const pdfBuffer = await generateInvoicePDF(order);

        // Return PDF as download
        const response = new NextResponse(pdfBuffer);
        response.headers.set('Content-Type', 'application/pdf');
        response.headers.set(
            'Content-Disposition',
            `attachment; filename="invoice-${order.orderNumber}.pdf"`
        );

        return response;

    } catch (error) {
        console.error('Error serving invoice:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate invoice' },
            { status: 500 }
        );
    }
}
