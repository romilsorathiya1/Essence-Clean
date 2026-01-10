import styles from '../../styles/Products.module.css';
import { FaLeaf, FaRecycle, FaShieldHeart, FaStar, FaCheck, FaTruck, FaArrowRight, FaBuilding, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa6';

export const metadata = {
    title: 'Shop | Essence Clean',
    description: 'Shop our premium eco-friendly cleaning products. All-natural formulas for a spotless, sustainable home.',
};

const products = [
    {
        id: 1,
        name: 'Complete Full Pack',
        tagline: 'Best Value Bundle',
        description: 'The ultimate cleaning bundle with all 3 scent variants. Includes spray bottles, refill packs for each scent, and premium microfiber cloths.',
        price: '₹2,499',
        originalPrice: '₹3,299',
        discount: '24% OFF',
        image: '/assets/fullPack.png',
        features: [
            '3x 500ml Spray Bottles (All Scents)',
            '3x 1L Refill Packs (All Scents)',
            '3x Premium Microfiber Cloths',
            'Elegant Gift Box Packaging'
        ],
        badge: 'Best Seller',
        rating: 4.9,
        reviews: 456,
        category: 'bundle'
    },
    {
        id: 2,
        name: 'Refill Pack Bundle',
        tagline: 'All 3 Scents',
        description: 'Complete refill set with all three refreshing scents. Keep your home smelling fresh with variety.',
        price: '₹1,199',
        originalPrice: '₹1,499',
        discount: '20% OFF',
        image: '/assets/refillPack.png',
        features: [
            '1L Lavender Bliss Refill',
            '1L Fresh Citrus Refill',
            '1L Ocean Breeze Refill',
            'Eco-Friendly Packaging'
        ],
        badge: 'Popular',
        rating: 4.8,
        reviews: 289,
        category: 'bundle'
    },
    {
        id: 3,
        name: 'Lavender Bliss Refill',
        tagline: 'Calming Scent',
        description: 'Soothing lavender fragrance for a relaxing clean. Perfect for bedrooms and living spaces.',
        price: '₹449',
        originalPrice: '₹549',
        discount: '18% OFF',
        image: '/assets/1refill.png',
        features: [
            '1L Concentrated Formula',
            'Calming Lavender Aroma',
            '4x Spray Bottle Refills',
            '100% Natural Ingredients'
        ],
        badge: null,
        rating: 4.7,
        reviews: 167,
        category: 'single',
        scent: 'lavender'
    },
    {
        id: 4,
        name: 'Fresh Citrus Refill',
        tagline: 'Energizing Scent',
        description: 'Zesty citrus blend for an energizing clean. Ideal for kitchens and high-traffic areas.',
        price: '₹449',
        originalPrice: '₹549',
        discount: '18% OFF',
        image: '/assets/2refill.png',
        features: [
            '1L Concentrated Formula',
            'Refreshing Citrus Aroma',
            '4x Spray Bottle Refills',
            '100% Natural Ingredients'
        ],
        badge: null,
        rating: 4.8,
        reviews: 198,
        category: 'single',
        scent: 'citrus'
    },
    {
        id: 5,
        name: 'Ocean Breeze Refill',
        tagline: 'Fresh Scent',
        description: 'Crisp ocean-inspired freshness for a clean atmosphere. Great for bathrooms and entryways.',
        price: '₹449',
        originalPrice: '₹549',
        discount: '18% OFF',
        image: '/assets/3refill.png',
        features: [
            '1L Concentrated Formula',
            'Fresh Ocean Aroma',
            '4x Spray Bottle Refills',
            '100% Natural Ingredients'
        ],
        badge: 'New',
        rating: 4.6,
        reviews: 124,
        category: 'single',
        scent: 'ocean'
    }
];

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
        title: 'Family Safe',
        description: 'No harsh chemicals'
    },
    {
        icon: <FaTruck />,
        title: 'Free Shipping',
        description: 'On orders above ₹999'
    }
];

export default function Products() {
    const bundles = products.filter(p => p.category === 'bundle');
    const singleRefills = products.filter(p => p.category === 'single');

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

            {/* Bundle Products */}
            <section className={styles.productsSection}>
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
                                        <span className={styles.currentPrice}>{product.price}</span>
                                        <span className={styles.originalPrice}>{product.originalPrice}</span>
                                        <span className={styles.discount}>{product.discount}</span>
                                    </div>

                                    <button className={styles.addToCartBtn}>
                                        Add to Cart
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Individual Scent Refills */}
            <section className={styles.refillsSection}>
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
                                            {product.rating} ({product.reviews})
                                        </span>
                                    </div>

                                    <p className={styles.productDescription}>{product.description}</p>

                                    <div className={styles.priceWrapper}>
                                        <span className={styles.currentPrice}>{product.price}</span>
                                        <span className={styles.originalPrice}>{product.originalPrice}</span>
                                        <span className={styles.discount}>{product.discount}</span>
                                    </div>

                                    <button className={styles.addToCartBtn}>
                                        Add to Cart
                                        <FaArrowRight />
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
                        <button className={styles.ctaBtn}>Shop the Full Pack</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
