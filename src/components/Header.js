import Link from 'next/link';
import styles from '../styles/Header.module.css';

const Header = () => {
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
                    <Link href="/products" className={styles.navLink}>Shop</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                </nav>

                <div className={styles.actions}>
                    <button className={styles.buyButton}>Buy Now</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
