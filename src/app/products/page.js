'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/Products.module.css';
import { FaLeaf, FaRecycle, FaShieldHeart, FaStar, FaCheck, FaTruck, FaArrowRight, FaBuilding, FaPhone, FaEnvelope, FaWhatsapp, FaMagnifyingGlass, FaBox } from 'react-icons/fa6';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';


const benefits = [
    {
        icon: <FaLeaf />,
        title: '100% Natural',
        description: 'Plant-based ingredients'
    },
    {
        icon: <FaRecycle />,
        title: 'Eco-Friendly',
        description: 'Sustainable packaging'
    },
    {
        icon: <FaShieldHeart />,
        title: 'Safe for All',
        description: 'Staff & customer safe'
    },
    {
        icon: <FaTruck />,
        title: 'Free Shipping',
        description: 'On orders above ₹999'
    }
];

export default function Products() {
    const { addToCart, openCart } = useCart();
    const [addedProducts, setAddedProducts] = useState({});

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const bundles = products.filter(p => p.category === 'bundle');
    const singleRefills = products.filter(p => p.category === 'single');

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedProducts(prev => ({ ...prev, [product.id]: true }));

        // Reset "Added" state after 2 seconds
        setTimeout(() => {
            setAddedProducts(prev => ({ ...prev, [product.id]: false }));
        }, 2000);
    };

    return (
        <div className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={`${styles.heroContainer} container`}>
                    <span className={styles.badge}>Premium Collection</span>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.titleAccent}>Shop</span>
                        <span className={styles.titleMain}>Our Products</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Discover the perfect cleaning solutions crafted with nature's finest ingredients.
                        Every product designed for effectiveness and sustainability.
                    </p>
                </div>
            </section>

            {/* Benefits Bar */}
            <section className={styles.benefitsBar}>
                <div className="container">
                    <div className={styles.benefitsGrid}>
                        {benefits.map((benefit, index) => (
                            <div key={index} className={styles.benefitItem}>
                                <span className={styles.benefitIcon}>{benefit.icon}</span>
                                <div className={styles.benefitText}>
                                    <strong>{benefit.title}</strong>
                                    <span>{benefit.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Track Order Banner */}
            <section className={styles.trackOrderBanner}>
                <div className="container">
                    <div className={styles.trackOrderContent}>
                        <div className={styles.trackOrderIcon}>
                            <FaBox />
                        </div>
                        <div className={styles.trackOrderText}>
                            <h3>Already ordered?</h3>
                            <p>Track your order status anytime without logging in</p>
                        </div>
                        <Link href="/track-order" className={styles.trackOrderBtn}>
                            <FaMagnifyingGlass /> Track Order
                        </Link>
                    </div>
                </div>
            </section>

            {/* Bundle Products */}
            <section className={styles.productsSection} id='accessories'>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Value Bundles</h2>
                        <p className={styles.sectionSubtitle}>Save more with our carefully curated bundles</p>
                    </div>
                    <div className={styles.bundleGrid}>
                        {bundles.map((product) => (
                            <div key={product.id} className={`${styles.productCard} ${styles.bundleCard}`}>
                                {product.badge && (
                                    <span className={styles.productBadge}>{product.badge}</span>
                                )}

                                <div className={styles.productImageWrapper}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={styles.productImage}
                                    />
                                </div>

                                <div className={styles.productContent}>
                                    <span className={styles.productTagline}>{product.tagline}</span>
                                    <h2 className={styles.productName}>{product.name}</h2>

                                    <div className={styles.ratingWrapper}>
                                        <div className={styles.stars}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty} />
                                            ))}
                                        </div>
                                        <span className={styles.ratingText}>
                                            {product.rating} ({product.reviews} reviews)
                                        </span>
                                    </div>



                                    <p className={styles.productDescription}>{product.description}</p>

                                    <ul className={styles.featuresList}>
                                        {product.features.map((feature, index) => (
                                            <li key={index}>
                                                <FaCheck className={styles.checkIcon} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className={styles.priceWrapper}>
                                        <span className={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
                                        {product.originalPrice && (
                                            <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
                                        )}
                                        <span className={styles.discount}>{product.discount}</span>
                                    </div>

                                    <button
                                        className={`${styles.addToCartBtn} ${addedProducts[product.id] ? styles.added : ''}`}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        {addedProducts[product.id] ? (
                                            <>Added to Cart <FaCheck /></>
                                        ) : (
                                            <>Add to Cart <FaArrowRight /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Individual Scent Refills */}
            <section className={styles.refillsSection} id='refills'>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Individual Scent Refills</h2>
                        <p className={styles.sectionSubtitle}>Choose your favorite fragrance</p>
                    </div>
                    <div className={styles.refillsGrid}>
                        {singleRefills.map((product) => (
                            <div key={product.id} className={`${styles.productCard} ${styles.refillCard}`}>
                                {product.badge && (
                                    <span className={styles.productBadge}>{product.badge}</span>
                                )}

                                <div className={`${styles.scentIndicator} ${styles[product.scent]}`}></div>

                                <div className={styles.productImageWrapper}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={styles.productImage}
                                    />
                                </div>

                                <div className={styles.productContent}>
                                    <span className={styles.productTagline}>{product.tagline}</span>
                                    <h2 className={styles.productName}>{product.name}</h2>

                                    <div className={styles.ratingWrapper}>
                                        <div className={styles.stars}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty} />
                                            ))}
                                        </div>
                                        <span className={styles.ratingText}>
                                            {product.rating} ({product.reviews} reviews)
                                        </span>
                                    </div>



                                    <p className={styles.productDescription}>{product.description}</p>

                                    <div className={styles.priceWrapper}>
                                        <span className={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
                                        {product.originalPrice && (
                                            <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
                                        )}
                                        <span className={styles.discount}>{product.discount}</span>
                                    </div>

                                    <button
                                        className={`${styles.addToCartBtn} ${addedProducts[product.id] ? styles.added : ''}`}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        {addedProducts[product.id] ? (
                                            <>Added to Cart <FaCheck /></>
                                        ) : (
                                            <>Add to Cart <FaArrowRight /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* B2B Section */}
            <section className={styles.b2bSection}>
                <div className="container">
                    <div className={styles.b2bHeader}>
                        <div className={styles.b2bIconLarge}>
                            <FaBuilding />
                        </div>
                        <span className={styles.b2bBadge}>For Business</span>
                        <h2 className={styles.b2bTitle}>Partner With Us</h2>
                        <p className={styles.b2bSubtitle}>
                            Special bulk pricing and customized solutions for hotels, restaurants, offices, and cleaning services
                        </p>
                    </div>

                    <div className={styles.b2bGrid}>
                        <div className={styles.b2bCard}>
                            <div className={styles.b2bCardIcon}>💰</div>
                            <h3>Wholesale Pricing</h3>
                            <p>Get special discounts on bulk orders with volume-based pricing tiers</p>
                        </div>
                        <div className={styles.b2bCard}>
                            <div className={styles.b2bCardIcon}>📦</div>
                            <h3>Custom Packaging</h3>
                            <p>Personalized branding and packaging options for your business</p>
                        </div>
                        <div className={styles.b2bCard}>
                            <div className={styles.b2bCardIcon}>🚚</div>
                            <h3>Priority Delivery</h3>
                            <p>Fast, reliable shipping with dedicated logistics support</p>
                        </div>
                        <div className={styles.b2bCard}>
                            <div className={styles.b2bCardIcon}>👤</div>
                            <h3>Account Manager</h3>
                            <p>Personal point of contact for all your orders and inquiries</p>
                        </div>
                    </div>

                    <div className={styles.b2bCta}>
                        <div className={styles.b2bCtaContent}>
                            <h3>Ready to get started?</h3>
                            <p>Contact our B2B team for custom quotes and partnership opportunities</p>
                        </div>
                        <div className={styles.b2bCtaActions}>
                            <a href="tel:+919876543210" className={styles.b2bPhoneBtn}>
                                <FaPhone />
                                +91 98765 43210
                            </a>
                            <a href="https://wa.me/919876543210" className={styles.b2bWhatsappBtn}>
                                <FaWhatsapp />
                                WhatsApp Us
                            </a>
                            <a href="mailto:b2b@essenceclean.in" className={styles.b2bEmailBtn}>
                                <FaEnvelope />
                                b2b@essenceclean.in
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <div className={styles.ctaBox}>
                        <h2>Not Sure Which Product to Choose?</h2>
                        <p>Start with our Complete Full Pack - get all 3 scents and save 24% on your first order.</p>
                        <button
                            className={styles.ctaBtn}
                            onClick={() => {
                                const fullPack = products.find(p => p.id === 1);
                                if (fullPack) {
                                    handleAddToCart(fullPack);
                                    openCart();
                                }
                            }}
                        >
                            Add Full Pack to Cart
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}