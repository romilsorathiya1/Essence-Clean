'use client';

import { useEffect, useState } from 'react';
import styles from '../../../styles/Admin.module.css';
import { FaPlus, FaPen, FaTrash, FaBox, FaXmark } from 'react-icons/fa6';
import CustomSelect from '@/components/CustomSelect';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        description: '',
        price: '',
        originalPrice: '',
        discount: '',
        image: '',
        category: 'single',
        scent: '',
        badge: '',
        stock: '',
        features: ''
    });

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();

            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            tagline: '',
            description: '',
            price: '',
            originalPrice: '',
            discount: '',
            image: '',
            category: 'single',
            scent: '',
            badge: '',
            stock: '',
            features: ''
        });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            tagline: product.tagline || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            originalPrice: product.originalPrice?.toString() || '',
            discount: product.discount || '',
            image: product.image || '',
            category: product.category || 'single',
            scent: product.scent || '',
            badge: product.badge || '',
            stock: product.stock?.toString() || '',
            features: product.features?.join('\n') || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
            stock: parseInt(formData.stock) || 0,
            features: formData.features.split('\n').filter(f => f.trim())
        };

        try {
            let response;
            if (editingProduct) {
                response = await fetch(`/api/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            } else {
                response = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }

            const data = await response.json();

            if (data.success) {
                setShowModal(false);
                fetchProducts();
            } else {
                alert(data.error || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                fetchProducts();
            } else {
                alert(data.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1>Products</h1>
                <p>Manage your product catalog</p>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2>All Products ({products.length})</h2>
                    <button onClick={openAddModal} className={styles.addBtn}>
                        <FaPlus />
                        Add Product
                    </button>
                </div>

                {products.length > 0 ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className={styles.productImage}
                                            />
                                        </td>
                                        <td>
                                            <strong>{product.name}</strong>
                                            {product.badge && (
                                                <span className={`${styles.badge} ${styles.active}`} style={{ marginLeft: '0.5rem' }}>
                                                    {product.badge}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            ₹{product.price?.toLocaleString()}
                                            {product.originalPrice && (
                                                <del style={{ color: '#999', marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                                                    ₹{product.originalPrice?.toLocaleString()}
                                                </del>
                                            )}
                                        </td>
                                        <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className={`${styles.actionBtn} ${styles.edit}`}
                                                    title="Edit"
                                                >
                                                    <FaPen />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className={`${styles.actionBtn} ${styles.delete}`}
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <FaBox />
                        <h3>No products yet</h3>
                        <p>Add your first product to get started.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.productModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.productModalHeader}>
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                                <FaXmark />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.productModalBody}>
                                <div className={styles.modalForm}>
                                    <div className={styles.formGroup}>
                                        <label>Product Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Tagline</label>
                                            <input
                                                type="text"
                                                name="tagline"
                                                value={formData.tagline}
                                                onChange={handleChange}
                                                placeholder="Short tagline"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Badge</label>
                                            <input
                                                type="text"
                                                name="badge"
                                                value={formData.badge}
                                                onChange={handleChange}
                                                placeholder="e.g., Best Seller"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Product description"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Price (₹) *</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="499"
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Original Price (₹)</label>
                                            <input
                                                type="number"
                                                name="originalPrice"
                                                value={formData.originalPrice}
                                                onChange={handleChange}
                                                placeholder="599"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Discount</label>
                                            <input
                                                type="text"
                                                name="discount"
                                                value={formData.discount}
                                                onChange={handleChange}
                                                placeholder="20% OFF"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Stock</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleChange}
                                                placeholder="100"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Category</label>
                                            <CustomSelect
                                                options={[
                                                    { value: 'single', label: 'Single' },
                                                    { value: 'bundle', label: 'Bundle' }
                                                ]}
                                                value={formData.category}
                                                onChange={(value) => setFormData({ ...formData, category: value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Scent</label>
                                            <CustomSelect
                                                options={[
                                                    { value: '', label: 'None' },
                                                    { value: 'lavender', label: 'Lavender' },
                                                    { value: 'citrus', label: 'Citrus' },
                                                    { value: 'ocean', label: 'Ocean' }
                                                ]}
                                                value={formData.scent}
                                                onChange={(value) => setFormData({ ...formData, scent: value })}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Image URL</label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="/assets/product.png"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Features (one per line)</label>
                                        <textarea
                                            name="features"
                                            value={formData.features}
                                            onChange={handleChange}
                                            placeholder="1L Concentrated Formula&#10;100% Natural Ingredients&#10;Eco-Friendly Packaging"
                                            rows={4}
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className={styles.productModalFooter}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.saveBtn}>
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
