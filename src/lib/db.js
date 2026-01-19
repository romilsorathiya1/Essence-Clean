import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

// Read entire database
export function readDB() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { products: [], orders: [], contacts: [], admins: [] };
    }
}

// Write entire database
export function writeDB(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

// Get all items from a collection
export function getAll(collection) {
    const db = readDB();
    return db[collection] || [];
}

// Get item by ID from a collection
export function getById(collection, id) {
    const db = readDB();
    const items = db[collection] || [];
    return items.find(item => item.id === parseInt(id));
}

// Create new item in a collection
export function create(collection, item) {
    const db = readDB();
    const items = db[collection] || [];

    // Generate new ID
    const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0);
    const newItem = {
        ...item,
        id: maxId + 1,
        createdAt: new Date().toISOString()
    };

    db[collection] = [...items, newItem];
    writeDB(db);
    return newItem;
}

// Update item by ID in a collection
export function update(collection, id, updates) {
    const db = readDB();
    const items = db[collection] || [];
    const index = items.findIndex(item => item.id === parseInt(id));

    if (index === -1) return null;

    const updatedItem = {
        ...items[index],
        ...updates,
        id: items[index].id, // Preserve original ID
        updatedAt: new Date().toISOString()
    };

    items[index] = updatedItem;
    db[collection] = items;
    writeDB(db);
    return updatedItem;
}

// Delete item by ID from a collection
export function remove(collection, id) {
    const db = readDB();
    const items = db[collection] || [];
    const index = items.findIndex(item => item.id === parseInt(id));

    if (index === -1) return false;

    items.splice(index, 1);
    db[collection] = items;
    writeDB(db);
    return true;
}

// Get admin by email
export function getAdminByEmail(email) {
    const db = readDB();
    const admins = db.admins || [];
    return admins.find(admin => admin.email === email);
}

// Get statistics for dashboard
export function getStats() {
    const db = readDB();

    const totalProducts = (db.products || []).filter(p => p.isActive).length;
    const totalOrders = (db.orders || []).length;
    const pendingOrders = (db.orders || []).filter(o => o.status === 'pending').length;
    const unreadMessages = (db.contacts || []).filter(c => !c.isRead).length;

    // Calculate revenue
    const totalRevenue = (db.orders || [])
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + (order.total || 0), 0);

    // Recent orders (last 5)
    const recentOrders = (db.orders || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return {
        totalProducts,
        totalOrders,
        pendingOrders,
        unreadMessages,
        totalRevenue,
        recentOrders
    };
}
