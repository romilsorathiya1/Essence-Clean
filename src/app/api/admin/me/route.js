import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/me - Get current admin user
export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error getting current user:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get user' },
            { status: 500 }
        );
    }
}
