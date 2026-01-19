import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminByEmail } from '@/lib/db';
import { generateToken, verifyPassword } from '@/lib/auth';

// POST /api/admin/login - Admin login
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.email || !body.password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find admin by email
        const admin = getAdminByEmail(body.email);

        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = verifyPassword(body.password, admin.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate token
        const token = generateToken({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        });

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60, // 24 hours
            path: '/'
        });

        return NextResponse.json({
            success: true,
            data: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
}
