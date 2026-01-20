import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/stats - Get dashboard statistics
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

        const stats = await getStats();

        return NextResponse.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get statistics' },
            { status: 500 }
        );
    }
}
