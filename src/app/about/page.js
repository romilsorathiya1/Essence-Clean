import styles from '../../styles/About.module.css';
import { FaLeaf, FaHeart, FaSeedling, FaRecycle, FaHandHoldingHeart, FaStar } from 'react-icons/fa6';

export const metadata = {
    title: 'Our Story | Essence Clean',
    description: 'Discover the story behind Essence Clean - premium, eco-friendly cleaning solutions crafted with care for your home and the planet.',
};

export default function About() {
    return (
        <div className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={`${styles.heroContainer} container`}>
                    <span className={styles.badge}>Our Journey</span>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.titleAccent}>The Story</span>
                        <span className={styles.titleMain}>Behind the Essence</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Born from a passion for nature and a commitment to conscious living,
                        Essence Clean represents the harmony between effective cleaning and environmental responsibility.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className={styles.mission}>
                <div className="container">
                    <div className={styles.missionGrid}>
                        <div className={styles.missionContent}>
                            <span className={styles.sectionBadge}>Our Mission</span>
                            <h2 className={styles.sectionTitle}>Clean for Today, <br />Safe for Tomorrow</h2>
                            <p className={styles.missionText}>
                                At Essence Clean, we believe that a spotless home shouldn't come at the cost of the environment.
                                Our mission is simple yet profound: to create cleaning solutions that are as effective as they are gentle—on surfaces, on skin, and on our planet.
                            </p>
                            <p className={styles.missionText}>
                                We've spent years perfecting formulas that harness the power of nature without compromising on performance.
                                Every ingredient is thoughtfully selected, every bottle is designed with sustainability in mind.
                            </p>
                        </div>
                        <div className={styles.missionVisual}>
                            <div className={styles.missionImageWrapper}>
                                <div className={styles.missionImagePlaceholder}>
                                    <FaLeaf className={styles.missionIcon} />
                                    <span>Pure &amp; Natural</span>
                                </div>
                            </div>
                            <div className={styles.floatingCard}>
                                <span className={styles.floatingNumber}>100%</span>
                                <span className={styles.floatingLabel}>Plant-Based Formula</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.values}>
                <div className="container">
                    <div className={styles.valuesHeader}>
                        <span className={styles.sectionBadge}>What We Stand For</span>
                        <h2 className={styles.sectionTitle}>Our Core Values</h2>
                        <p className={styles.valuesSubtitle}>
                            These principles guide every decision we make, from ingredient sourcing to packaging design.
                        </p>
                    </div>

                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <FaSeedling />
                            </div>
                            <h3>Sustainability</h3>
                            <p>Every product is designed with the environment in mind, from biodegradable formulas to recyclable packaging.</p>
                        </div>

                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <FaHeart />
                            </div>
                            <h3>Family Safe</h3>
                            <p>Free from harsh chemicals and toxins, our products are safe for homes with children and pets.</p>
                        </div>

                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <FaRecycle />
                            </div>
                            <h3>Zero Waste Goal</h3>
                            <p>We're committed to reducing waste through refillable systems and sustainable packaging solutions.</p>
                        </div>

                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <FaHandHoldingHeart />
                            </div>
                            <h3>Community First</h3>
                            <p>We believe in giving back, supporting local communities and environmental initiatives.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Timeline Section */}
            <section className={styles.journey}>
                <div className="container">
                    <div className={styles.journeyHeader}>
                        <span className={styles.sectionBadge}>Our Timeline</span>
                        <h2 className={styles.sectionTitle}>The Journey So Far</h2>
                    </div>

                    <div className={styles.timeline}>
                        {/* 2021 - Right Side (odd) */}
                        <div className={`${styles.timelineItem} ${styles.timelineRight}`}>
                            <div className={styles.timelineContent}>
                                <span className={styles.timelineYear}>2021</span>
                                <h3>The Beginning</h3>
                                <p>Founded with a vision to revolutionize home cleaning with natural, effective solutions.</p>
                            </div>
                        </div>

                        {/* 2022 - Left Side (even) */}
                        <div className={`${styles.timelineItem} ${styles.timelineLeft}`}>
                            <div className={styles.timelineContent}>
                                <span className={styles.timelineYear}>2022</span>
                                <h3>First Launch</h3>
                                <p>Introduced our signature All-in-One Cleaning Spray to the market.</p>
                            </div>
                        </div>

                        {/* 2023 - Right Side (odd) */}
                        <div className={`${styles.timelineItem} ${styles.timelineRight}`}>
                            <div className={styles.timelineContent}>
                                <span className={styles.timelineYear}>2023</span>
                                <h3>Growing Family</h3>
                                <p>Expanded our product line with eco-friendly refill packs and accessories.</p>
                            </div>
                        </div>

                        {/* 2024 - Left Side (even) */}
                        <div className={`${styles.timelineItem} ${styles.timelineLeft}`}>
                            <div className={styles.timelineContent}>
                                <span className={styles.timelineYear}>2024</span>
                                <h3>10,000+ Homes</h3>
                                <p>Reached a milestone of serving over 10,000 happy, eco-conscious households.</p>
                            </div>
                        </div>

                        {/* 2025 - Right Side (odd) */}
                        <div className={`${styles.timelineItem} ${styles.timelineRight}`}>
                            <div className={styles.timelineContent}>
                                <span className={styles.timelineYear}>2025</span>
                                <h3>Nationwide Expansion</h3>
                                <p>Extended our reach across the country with new distribution partnerships.</p>
                            </div>
                        </div>

                        {/* 2026 - Left Side (even) */}
                        <div className={`${styles.timelineItem} ${styles.timelineLeft}`}>
                            <div className={styles.timelineContent}>
                                <span className={styles.timelineYear}>2026</span>
                                <h3>Innovation Continues</h3>
                                <p>Launching new sustainable product lines and expanding our eco-friendly mission.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>10K+</span>
                            <span className={styles.statLabel}>Happy Customers</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>100%</span>
                            <span className={styles.statLabel}>Natural Ingredients</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>50+</span>
                            <span className={styles.statLabel}>Surface Types</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>0</span>
                            <span className={styles.statLabel}>Harsh Chemicals</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promise Section */}
            <section className={styles.promise}>
                <div className="container">
                    <div className={styles.promiseContent}>
                        <FaStar className={styles.promiseIcon} />
                        <h2 className={styles.promiseTitle}>Our Promise to You</h2>
                        <p className={styles.promiseText}>
                            Every bottle of Essence Clean is a promise—a promise of purity, performance, and planet-conscious care.
                            We are committed to transparency, quality, and continuous improvement.
                            When you choose Essence Clean, you're not just choosing a cleaner; you're choosing a cleaner future.
                        </p>
                        <button className={styles.promiseBtn}>Explore Our Products</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
