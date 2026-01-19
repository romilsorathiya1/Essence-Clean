import Link from 'next/link';
import styles from '../styles/Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`${styles.container} container`}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>ESSENCE</span>
                            <span className={styles.logoSubtext}>CLEAN</span>
                        </div>
                        <p className={styles.description}>
                            Elevating the art of cleanliness with premium, sustainable solutions for hotels, cafes, offices, and homes.
                        </p>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.linkGroup}>
                            <h3>Product</h3>
                            <Link href="/products">All-in-One Spray</Link>
                            <Link href="/products#refills">Refill Packs</Link>
                            <Link href="/products#accessories">Accessories</Link>
                        </div>
                        <div className={styles.linkGroup}>
                            <h3>Company</h3>
                            <Link href="/about">Our Story</Link>
                            <Link href="/sustainability">Sustainability</Link>
                            <Link href="/press">Press</Link>
                        </div>
                        <div className={styles.linkGroup}>
                            <h3>Support</h3>
                            <Link href="/track-order">Track Order</Link>
                            <Link href="/contact#faq">FAQ</Link>
                            <Link href="/shipping">Shipping</Link>
                            <Link href="/contact">Contact Us</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Essence Clean. All rights reserved.</p>
                    <div className={styles.socials}>
                        <a href="#">Instagram</a>
                        <a href="#">Pinterest</a>
                        <a href="#">Facebook</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
