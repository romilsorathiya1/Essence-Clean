'use client';

import { useCart } from '@/context/CartContext';
import styles from '@/styles/CartDrawer.module.css';
import { FaXmark, FaPlus, FaMinus, FaTrash, FaBagShopping } from 'react-icons/fa6';
import Link from 'next/link';

export default function CartDrawer() {
    const {
        cartItems,
        cartTotal,
        cartCount,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart
    } = useCart();

    if (!isCartOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className={styles.overlay} onClick={closeCart} />

            {/* Drawer */}
            <div className={styles.drawer}>
                <div className={styles.header}>
                    <h2>
                        <FaBagShopping />
                        Your Cart ({cartCount})
                    </h2>
                    <button onClick={closeCart} className={styles.closeBtn}>
                        <FaXmark />
                    </button>
                </div>

                <div className={styles.content}>
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <FaBagShopping className={styles.emptyIcon} />
                            <h3>Your cart is empty</h3>
                            <p>Add some products to get started</p>
                            <Link href="/products" onClick={closeCart} className={styles.shopBtn}>
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className={styles.items}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.item}>
                                        <div className={styles.itemImage}>
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className={styles.itemDetails}>
                                            <h4>{item.name}</h4>
                                            <p className={styles.itemPrice}>₹{item.price.toLocaleString()}</p>
                                            <div className={styles.quantityControls}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className={styles.qtyBtn}
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span className={styles.quantity}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className={styles.qtyBtn}
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.itemActions}>
                                            <p className={styles.itemTotal}>
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className={styles.removeBtn}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.footer}>
                                <div className={styles.subtotal}>
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <p className={styles.shippingNote}>
                                    Shipping calculated at checkout
                                </p>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className={styles.checkoutBtn}
                                >
                                    Proceed to Checkout
                                </Link>
                                <button onClick={closeCart} className={styles.continueBtn}>
                                    Continue Shopping
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
