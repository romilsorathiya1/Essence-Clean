import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tagline: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        default: null
    },
    discount: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: '/assets/placeholder.png'
    },
    features: {
        type: [String],
        default: []
    },
    badge: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },

    category: {
        type: String,
        enum: ['bundle', 'single'],
        default: 'single'
    },
    scent: {
        type: String,
        default: null
    },
    stock: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

// Prevent model recompilation in development
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
