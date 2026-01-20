import { NextResponse } from 'next/server';
import { getById, update, remove } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/products/[id] - Get single product (public)
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const product = await getById('products', id);

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id] - Update product (admin only)
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

        // Check if product exists
        const existing = await getById('products', id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Update product
        const updatedProduct = await update('products', id, {
            name: body.name ?? existing.name,
            tagline: body.tagline ?? existing.tagline,
            description: body.description ?? existing.description,
            price: body.price !== undefined ? parseFloat(body.price) : existing.price,
            originalPrice: body.originalPrice !== undefined ? parseFloat(body.originalPrice) : existing.originalPrice,
            discount: body.discount ?? existing.discount,
            image: body.image ?? existing.image,
            features: body.features ?? existing.features,
            badge: body.badge ?? existing.badge,
            rating: body.rating ?? existing.rating,
            reviews: body.reviews ?? existing.reviews,
            category: body.category ?? existing.category,
            scent: body.scent ?? existing.scent,
            stock: body.stock ?? existing.stock,
            isActive: body.isActive ?? existing.isActive
        });

        return NextResponse.json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE /api/products/[id] - Delete product (admin only)
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

        // Check if product exists
        const existing = await getById('products', id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        // Delete product
        const deleted = await remove('products', id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Failed to delete product' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
