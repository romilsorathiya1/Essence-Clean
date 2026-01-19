import { cookies } from 'next/headers';

// Simple JWT-like token generation (for demo purposes)
// In production, use a proper library like jose or jsonwebtoken

const SECRET_KEY = 'essence-clean-secret-key-2026';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Simple base64 encoding for token
function base64Encode(str) {
    return Buffer.from(str).toString('base64');
}

function base64Decode(str) {
    return Buffer.from(str, 'base64').toString('utf8');
}

// Generate a simple token
export function generateToken(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Date.now();
    const data = {
        ...payload,
        iat: now,
        exp: now + TOKEN_EXPIRY
    };

    const headerB64 = base64Encode(JSON.stringify(header));
    const payloadB64 = base64Encode(JSON.stringify(data));
    const signature = base64Encode(SECRET_KEY + headerB64 + payloadB64);

    return `${headerB64}.${payloadB64}.${signature}`;
}

// Verify and decode token
export function verifyToken(token) {
    try {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [headerB64, payloadB64, signature] = parts;

        // Verify signature
        const expectedSignature = base64Encode(SECRET_KEY + headerB64 + payloadB64);
        if (signature !== expectedSignature) return null;

        // Decode payload
        const payload = JSON.parse(base64Decode(payloadB64));

        // Check expiry
        if (payload.exp && Date.now() > payload.exp) return null;

        return payload;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}

// Simple password verification (plain text comparison for demo)
// In production, use bcrypt
export function verifyPassword(inputPassword, storedPassword) {
    // For demo, we'll use a simple check
    // Default password: admin123
    if (storedPassword.startsWith('$2a$')) {
        // This is our placeholder hash, check against default
        return inputPassword === 'admin123';
    }
    return inputPassword === storedPassword;
}

// Hash password (simple for demo)
export function hashPassword(password) {
    // In production, use bcrypt
    return password;
}

// Get current user from cookies
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) return null;

        const payload = verifyToken(token);
        return payload;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

// Check if request is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return user !== null;
}

// Middleware helper to protect routes
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        return { authorized: false, user: null };
    }
    return { authorized: true, user };
}
