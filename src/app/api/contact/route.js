import { NextResponse } from 'next/server';
import { getAll, create, find } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/contact - Get all messages (admin only)
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
            query.name = { $regex: search, $options: 'i' };
        }

        if (status && status !== 'all') {
            if (status === 'unread') query.isRead = false;
            if (status === 'read') {
                query.isRead = true;
                query.isReplied = false;
            }
            if (status === 'replied') query.isReplied = true;
        }

        // Import find dynamically if not already imported, or use existing generic find
        // Note: ensuring 'find' is imported from db.js
        const contacts = await find('contacts', query);
        // Sort by date, newest first
        contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return NextResponse.json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}

// POST /api/contact - Submit contact form (public)
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['name', 'email', 'message'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create contact message
        const newContact = await create('contacts', {
            name: body.name,
            email: body.email,
            phone: body.phone || '',
            subject: body.subject || 'General Inquiry',
            message: body.message,
            isRead: false,
            isReplied: false
        });

        return NextResponse.json({
            success: true,
            data: newContact,
            message: 'Thank you for your message! We will get back to you soon.'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating contact:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit message' },
            { status: 500 }
        );
    }
}
