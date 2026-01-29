import { NextResponse } from 'next/server';
import { create } from '@/lib/db';
import Product from '@/models/Product';
import connectDB from '@/lib/mongodb';

export async function GET() {
    try {
        await connectDB();

        // delete all products
        await Product.deleteMany({});

        const newProducts = [
            {
                name: 'Complete Full Pack',
                tagline: 'Best Value Bundle',
                description: 'The ultimate cleaning bundle for businesses and homes. Perfect for hotels, restaurants, and offices. Includes spray bottles, refill packs, and microfiber cloths.',
                price: 2499,
                originalPrice: 3299,
                discount: '24% OFF',
                image: '/assets/fullPack.png',
                features: [
                    '3x 500ml Spray Bottles (All Scents)',
                    '3x 1L Refill Packs (All Scents)',
                    '3x Premium Microfiber Cloths',
                    'Elegant Gift Box Packaging'
                ],
                badge: 'Best Seller',
                rating: 4.9,
                reviews: 456,
                category: 'bundle'
            },
            {
                name: 'Refill Pack Bundle',
                tagline: 'All 3 Scents',
                description: 'Complete refill set with all three refreshing scents. Ideal for commercial spaces and bulk usage.',
                price: 1199,
                originalPrice: 1499,
                discount: '20% OFF',
                image: '/assets/refillPack.png',
                features: [
                    '1L Lavender Bliss Refill',
                    '1L Fresh Citrus Refill',
                    '1L Ocean Breeze Refill',
                    'Eco-Friendly Packaging'
                ],
                badge: 'Popular',
                rating: 4.8,
                reviews: 289,
                category: 'bundle'
            },
            {
                name: 'Lavender Bliss Refill',
                tagline: 'Calming Scent',
                description: 'Soothing lavender fragrance for a premium ambiance. Perfect for hotel rooms, spas, and reception areas.',
                price: 449,
                originalPrice: 549,
                discount: '18% OFF',
                image: '/assets/1refill.png',
                features: [
                    '1L Concentrated Formula',
                    'Calming Lavender Aroma',
                    '4x Spray Bottle Refills',
                    '100% Natural Ingredients'
                ],
                badge: null,
                rating: 4.7,
                reviews: 167,
                category: 'single',
                scent: 'lavender'
            },
            {
                name: 'Fresh Citrus Refill',
                tagline: 'Energizing Scent',
                description: 'Zesty citrus blend for an energizing clean. Ideal for restaurant kitchens, cafes, and food service areas.',
                price: 449,
                originalPrice: 549,
                discount: '18% OFF',
                image: '/assets/2refill.png',
                features: [
                    '1L Concentrated Formula',
                    'Refreshing Citrus Aroma',
                    '4x Spray Bottle Refills',
                    '100% Natural Ingredients'
                ],
                badge: null,
                rating: 4.8,
                reviews: 198,
                category: 'single',
                scent: 'citrus'
            },
            {
                name: 'Ocean Breeze Refill',
                tagline: 'Fresh Scent',
                description: 'Crisp ocean-inspired freshness for a clean atmosphere. Great for office restrooms, lobbies, and commercial spaces.',
                price: 449,
                originalPrice: 549,
                discount: '18% OFF',
                image: '/assets/3refill.png',
                features: [
                    '1L Concentrated Formula',
                    'Fresh Ocean Aroma',
                    '4x Spray Bottle Refills',
                    '100% Natural Ingredients'
                ],
                badge: 'New',
                rating: 4.6,
                reviews: 124,
                category: 'single',
                scent: 'ocean'
            }
        ];

        for (const product of newProducts) {
            await create('products', product);
        }

        return NextResponse.json({ success: true, message: 'Database reset and seeded with new products successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
