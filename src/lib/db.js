import connectDB from './mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Contact from '@/models/Contact';
import Admin from '@/models/Admin';

// Map collection names to models
const models = {
    products: Product,
    orders: Order,
    contacts: Contact,
    admins: Admin
};

// Ensure database connection
async function ensureConnection() {
    await connectDB();
}

// Get all items from a collection
export async function getAll(collection) {
    await ensureConnection();
    const Model = models[collection];
    if (!Model) return [];

    const items = await Model.find({}).lean();
    // Convert _id to id for backward compatibility
    return items.map(item => ({
        ...item,
        id: item._id.toString(),
        _id: undefined
    }));
}

// Find items with a custom query
export async function find(collection, query = {}) {
    await ensureConnection();
    const Model = models[collection];
    if (!Model) return [];

    try {
        const items = await Model.find(query).lean();
        return items.map(item => ({
            ...item,
            id: item._id.toString(),
            _id: undefined
        }));
    } catch (error) {
        console.error('Error in find:', error.message);
        return [];
    }
}

// Get item by ID from a collection
export async function getById(collection, id) {
    await ensureConnection();
    const Model = models[collection];
    if (!Model) return null;

    try {
        const item = await Model.findById(id).lean();
        if (!item) return null;
        return {
            ...item,
            id: item._id.toString(),
            _id: undefined
        };
    } catch (error) {
        // If id is not a valid ObjectId, return null
        console.error('Error in getById:', error.message);
        return null;
    }
}

// Create new item in a collection
export async function create(collection, itemData) {
    await ensureConnection();
    const Model = models[collection];
    if (!Model) return null;

    const newItem = await Model.create(itemData);
    const item = newItem.toObject();
    return {
        ...item,
        id: item._id.toString(),
        _id: undefined
    };
}

// Update item by ID in a collection
export async function update(collection, id, updates) {
    await ensureConnection();
    const Model = models[collection];
    if (!Model) return null;

    try {
        const updatedItem = await Model.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedItem) return null;
        return {
            ...updatedItem,
            id: updatedItem._id.toString(),
            _id: undefined
        };
    } catch (error) {
        console.error('Error in update:', error.message);
        return null;
    }
}

// Delete item by ID from a collection
export async function remove(collection, id) {
    await ensureConnection();
    const Model = models[collection];
    if (!Model) return false;

    try {
        const result = await Model.findByIdAndDelete(id);
        return result !== null;
    } catch (error) {
        console.error('Error in remove:', error.message);
        return false;
    }
}

// Get admin by email
export async function getAdminByEmail(email) {
    await ensureConnection();
    const admin = await Admin.findOne({ email: email.toLowerCase() }).lean();
    if (!admin) return null;
    return {
        ...admin,
        id: admin._id.toString(),
        _id: undefined
    };
}

// Get statistics for dashboard
export async function getStats() {
    await ensureConnection();

    const [
        totalProducts,
        totalOrders,
        pendingOrders,
        unreadMessages,
        deliveredOrders,
        recentOrders
    ] = await Promise.all([
        Product.countDocuments({ isActive: true }),
        Order.countDocuments({}),
        Order.countDocuments({ status: 'pending' }),
        Contact.countDocuments({ isRead: false }),
        Order.find({ status: 'delivered' }).lean(),
        Order.find({}).sort({ createdAt: -1 }).limit(5).lean()
    ]);

    // Calculate revenue from delivered orders
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Format recent orders with id
    const formattedRecentOrders = recentOrders.map(order => ({
        ...order,
        id: order._id.toString(),
        _id: undefined
    }));

    return {
        totalProducts,
        totalOrders,
        pendingOrders,
        unreadMessages,
        totalRevenue,
        recentOrders: formattedRecentOrders
    };
}

// Find order by order number and email (for order tracking)
export async function findOrderByNumberAndEmail(orderNumber, email) {
    await ensureConnection();
    const order = await Order.findOne({
        orderNumber: { $regex: new RegExp(`^${orderNumber}$`, 'i') },
        customerEmail: { $regex: new RegExp(`^${email}$`, 'i') }
    }).lean();

    if (!order) return null;
    return {
        ...order,
        id: order._id.toString(),
        _id: undefined
    };
}
