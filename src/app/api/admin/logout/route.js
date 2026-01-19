import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/admin/logout - Admin logout
export async function POST() {
    try {
        // Clear the admin token cookie
        const cookieStore = await cookies();
        cookieStore.delete('admin_token');

        return NextResponse.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json(
            { success: false, error: 'Logout failed' },
            { status: 500 }
        );
    }
}
