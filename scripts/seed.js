/**
 * Seed script to migrate data from JSON file to MongoDB
 * Run with: node scripts/seed.js
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define MONGODB_URI in your .env file');
    process.exit(1);
}

// Define schemas inline to avoid module resolution issues
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    discount: { type: String, default: null },
    image: { type: String, default: '/assets/placeholder.png' },
    features: { type: [String], default: [] },
    badge: { type: String, default: null },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    category: { type: String, enum: ['bundle', 'single'], default: 'single' },
    scent: { type: String, default: null },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const OrderItemSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    quantity: Number
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String, default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    notes: { type: String, default: '' },
    trackingNumber: { type: String, default: null }
}, { timestamps: true });

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isReplied: { type: Boolean, default: false },
    replyNote: { type: String, default: null }
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Admin = mongoose.model('Admin', AdminSchema);

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB!');

        // Read JSON data
        const dbPath = path.join(__dirname, '..', 'src', 'data', 'db.json');
        const jsonData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

        console.log('\n--- Starting data migration ---\n');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('Clearing existing data...');
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Contact.deleteMany({});
        await Admin.deleteMany({});

        // Seed Products
        if (jsonData.products && jsonData.products.length > 0) {
            console.log(`Seeding ${jsonData.products.length} products...`);
            for (const product of jsonData.products) {
                const { id, ...productData } = product;
                await Product.create(productData);
            }
            console.log('✓ Products seeded successfully');
        }

        // Seed Orders
        if (jsonData.orders && jsonData.orders.length > 0) {
            console.log(`Seeding ${jsonData.orders.length} orders...`);
            for (const order of jsonData.orders) {
                const { id, ...orderData } = order;
                await Order.create(orderData);
            }
            console.log('✓ Orders seeded successfully');
        }

        // Seed Contacts
        if (jsonData.contacts && jsonData.contacts.length > 0) {
            console.log(`Seeding ${jsonData.contacts.length} contacts...`);
            for (const contact of jsonData.contacts) {
                const { id, ...contactData } = contact;
                await Contact.create(contactData);
            }
            console.log('✓ Contacts seeded successfully');
        }

        // Seed Admins
        if (jsonData.admins && jsonData.admins.length > 0) {
            console.log(`Seeding ${jsonData.admins.length} admins...`);
            for (const admin of jsonData.admins) {
                const { id, ...adminData } = admin;
                await Admin.create(adminData);
            }
            console.log('✓ Admins seeded successfully');
        }

        console.log('\n--- Migration complete! ---\n');

        // Print summary
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const contactCount = await Contact.countDocuments();
        const adminCount = await Admin.countDocuments();

        console.log('Summary:');
        console.log(`  Products: ${productCount}`);
        console.log(`  Orders: ${orderCount}`);
        console.log(`  Contacts: ${contactCount}`);
        console.log(`  Admins: ${adminCount}`);

    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

seed();
