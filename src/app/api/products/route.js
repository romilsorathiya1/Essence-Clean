import { NextResponse } from 'next/server';
import { getAll, create } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/products - Get all products (public)
export async function GET() {
    try {
        const products = await getAll('products');

        return NextResponse.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST /api/products - Create new product (admin only)
export async function POST(request) {
    try {
        // Check authentication
        const { authorized } = await requireAuth();
        if (!authorized) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate required fields
        const requiredFields = ['name', 'price', 'description'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create product with defaults
        const newProduct = await create('products', {
            name: body.name,
            tagline: body.tagline || '',
            description: body.description,
            price: parseFloat(body.price),
            originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
            discount: body.discount || null,
            image: body.image || '/assets/placeholder.png',
            features: body.features || [],
            badge: body.badge || null,
            rating: body.rating || 0,
            reviews: body.reviews || 0,
            category: body.category || 'single',
            scent: body.scent || null,
            stock: body.stock || 0,
        });

        return NextResponse.json({
            success: true,
            data: newProduct
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
