import { NextResponse } from 'next/server';
import { getById, update, remove } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/contact/[id] - Get single message (admin only)
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
        const contact = getById('contacts', id);

        if (!contact) {
            return NextResponse.json(
                { success: false, error: 'Message not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch message' },
            { status: 500 }
        );
    }
}

// PUT /api/contact/[id] - Update message (admin only)
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

        // Check if message exists
        const existing = getById('contacts', id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Message not found' },
                { status: 404 }
            );
        }

        // Update message
        const updatedContact = update('contacts', id, {
            isRead: body.isRead ?? existing.isRead,
            isReplied: body.isReplied ?? existing.isReplied,
            replyNote: body.replyNote ?? existing.replyNote
        });

        return NextResponse.json({
            success: true,
            data: updatedContact
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update message' },
            { status: 500 }
        );
    }
}

// DELETE /api/contact/[id] - Delete message (admin only)
export async function DELETE(request, { params }) {
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

        // Check if message exists
        const existing = getById('contacts', id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Message not found' },
                { status: 404 }
            );
        }

        // Delete message
        const deleted = remove('contacts', id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Failed to delete message' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete message' },
            { status: 500 }
        );
    }
}
