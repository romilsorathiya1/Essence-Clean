'use client';

import Link from 'next/link';
import styles from '../styles/Header.module.css';
import { useCart } from '@/context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const Header = () => {
    const { cartCount, openCart } = useCart();

    return (
        <header className={styles.header}>
            <div className={`${styles.container} container`}>
                <div className={styles.logo}>
                    <Link href="/">
                        <span className={styles.logoText}>ESSENCE</span>
                        <span className={styles.logoSubtext}>CLEAN</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/about" className={styles.navLink}>Our Story</Link>
                    <Link href="/sustainability" className={styles.navLink}>Sustainability</Link>
                    <Link href="/products" className={styles.navLink}>Shop</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                </nav>

                <div className={styles.actions}>
                    <button onClick={openCart} className={styles.cartButton}>
                        <FaShoppingCart />
                        {cartCount > 0 && (
                            <span className={styles.cartCount}>{cartCount}</span>
                        )}
                    </button>
                    <Link href="/products" className={styles.buyButton}>Shop Now</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;

