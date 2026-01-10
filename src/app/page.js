import styles from '../styles/Home.module.css';
import { FaLeaf, FaHeart } from 'react-icons/fa6';
import { MdWindow, MdDoorSliding, MdCountertops, MdBathroom, MdKitchen, MdChair, MdDirectionsCar } from 'react-icons/md';
import { BsGrid3X3Gap } from 'react-icons/bs';

export default function Home() {
    return (
        <div className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}></div>

                <div className={`${styles.heroContainer} container`}>
                    <div className={styles.heroContent}>
                        <span className={styles.badge}>Pure • Botanical • Essential</span>
                        <h1 className={styles.title}>
                            <span className={styles.titleTop}>The Essence of</span>
                            <span className={styles.titleBottom}>PURE LIVING</span>
                        </h1>

                        <div className={styles.galleryArch}>
                            <div className={styles.productDisplay}>
                                <div className={styles.imageBox}>
                                    <img
                                        src="/assets/herofullproductkit.png"
                                        alt="Premium All-in-One Cleaning Spray"
                                        width={800}
                                        height={750}
                                        className={styles.productImg}
                                    />
                                </div>
                            </div>

                            <p className={styles.subtitle}>
                                Experience deep cleaning power without the harsh chemicals.
                                Carefully crafted for the modern, conscious home.
                            </p>

                            <div className={styles.cta}>
                                <button className={styles.primaryBtn}>Shop the Collection</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className={styles.products}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Our Products</h2>
                        <p className={styles.sectionSubtitle}>Choose the perfect solution for your cleaning needs</p>
                    </div>

                    <div className={styles.productGrid}>
                        {/* Full Kit Product */}
                        <div className={styles.productCard}>
                            <div className={styles.productImageWrapper}>
                                <img
                                    src="/assets/fullPack.png"
                                    alt="Full Cleaning Kit"
                                    className={styles.productImage}
                                />
                            </div>
                            <div className={styles.productInfo}>
                                <h3>Complete Cleaning Kit</h3>
                                <p className={styles.productDescription}>Everything you need for a premium cleaning experience. Includes spray bottle, refill pack, and microfiber cloth.</p>
                                <ul className={styles.productFeatures}>
                                    <li>500ml Spray Bottle</li>
                                    <li>2L Refill Pack</li>
                                    <li>Premium Microfiber Cloth</li>
                                </ul>
                                <button className={styles.productBtn}>Shop Full Kit</button>
                            </div>
                        </div>

                        {/* Refill Pack Product */}
                        <div className={styles.productCard}>
                            <div className={styles.productImageWrapper}>
                                <img
                                    src="/assets/refillPack.png"
                                    alt="Refill Pack"
                                    className={styles.productImage}
                                />
                            </div>
                            <div className={styles.productInfo}>
                                <h3>Refill Pack</h3>
                                <p className={styles.productDescription}>Keep your bottle full and your home clean. Eco-friendly refill solution for sustainable cleaning.</p>
                                <ul className={styles.productFeatures}>
                                    <li>2L Concentrated Formula</li>
                                    <li>Eco-Friendly Packaging</li>
                                    <li>Long-Lasting Value</li>
                                </ul>
                                <button className={styles.productBtn}>Shop Refill Pack</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className={styles.benefits}>
                <div className={styles.benefitsContainer}> {/* Changed to custom container for wider width */}
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Why Essence Clean?</h2>
                        <p className={styles.sectionSubtitle}>Standard cleaners leave residue. We leave nothing but a natural glow.</p>
                    </div>

                    <div className={styles.benefitGrid}>
                        <div className={styles.benefitCard}>
                            <div className={styles.iconWrapper}>
                                <FaLeaf className={styles.icon} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Multi-Surface</h3>
                                <p>Works on glass, tiles, marble, wood & more</p>
                            </div>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.iconWrapper}>
                                <FaLeaf className={styles.icon} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Eco-Friendly</h3>
                                <p>Made with natural, biodegradable ingredients</p>
                            </div>
                        </div>
                        <div className={styles.benefitCard}>
                            <div className={styles.iconWrapper}>
                                <FaHeart className={styles.icon} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Long Lasting Scent</h3>
                                <p>Infused with premium fragrance oils</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Versatility Section */}
            <section className={styles.versatilityShowcase}>
                <div className="container">
                    <div className={styles.versatilityBadge}>VERSATILITY</div>
                    <h2 className={styles.versatilityTitle}>One Cleaner, Endless Possibilities</h2>
                    <p className={styles.versatilitySubtitle}>Our all-in-one formula works beautifully on all these surfaces</p>

                    <div className={styles.surfaceGrid}>
                        <div className={styles.surfaceCard}>
                            <div className={styles.surfaceIcon}>
                                <BsGrid3X3Gap />
                            </div>
                            <p>Tiles</p>
                        </div>
                        <div className={styles.surfaceCard}>
                            <div className={styles.surfaceIcon}>
                                <MdWindow />
                            </div>
                            <p>Windows</p>
                        </div>
                        <div className={styles.surfaceCard}>
                            <div className={styles.surfaceIcon}>
                                <MdDoorSliding />
                            </div>
                            <p>Glass Doors</p>
                        </div>
                        <div className={styles.surfaceCard}>
                            <div className={styles.surfaceIcon}>
                                <MdCountertops />
                            </div>
                            <p>Countertops</p>
                        </div>
                        <div className={styles.surfaceCard}>
                            <div className={styles.surfaceIcon}>
                                <MdBathroom />
                            </div>
                            <p>Bathrooms</p>
                        </div>
                        <div className={styles.surfaceCard}>
                            <div className={styles.surfaceIcon}>
                                <MdKitchen />
                            </div>
                            <p>Kitchen</p>
                        </div>
                        <div className={styles.surfaceCard}>
                            <div className={styles.surfaceIcon}>
                                <MdChair />
                            </div>
                            <p>Furniture</p>
                        </div>
                        <div className={styles.surfaceCard}>
                            <div className={styles.surfaceIcon}>
                                <MdDirectionsCar />
                            </div>
                            <p>Car Interiors</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Use Section (formerly Versatility) */}
            <section className={styles.versatility}>
                <div className={`${styles.vsContainer} container`}>
                    <div className={styles.vsImage}>
                        <div className={styles.vsPlaceholder}>
                            <img
                                src="/assets/steps.png"
                                alt="How to use steps"
                                className={styles.stepsImage}
                            />
                        </div>
                    </div>
                    <div className={styles.vsContent}>
                        <h2 className={styles.vsTitle}>How to Use</h2>
                        <p>Experience the simplicity of our cleaning ritual. Designed for efficiency and effectiveness, providing a spotless finish in seconds.</p>
                        <ul className={styles.vsList}>
                            <li>Shake well before use to activate ingredients</li>
                            <li>Spray directly onto the surface from 6 inches away</li>
                            <li>Wipe clean with a microfiber cloth or paper towel</li>
                        </ul>
                        <button className={styles.primaryBtn}>Shop Now</button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.finalCta}>
                <div className="container">
                    <div className={styles.ctaBox}>
                        <h2>Ready to transform your home?</h2>
                        <p>Join the movement towards conscious, premium cleaning.</p>
                        <button className={styles.whiteBtn}>Get Started Today</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
