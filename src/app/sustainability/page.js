'use client';

import styles from '../../styles/Sustainability.module.css';
import { FaLeaf, FaRecycle, FaWater, FaSeedling, FaHandHoldingHeart, FaEarthAmericas, FaBottleDroplet, FaBoxOpen, FaTruck, FaArrowRight } from 'react-icons/fa6';
import Link from 'next/link';

export default function Sustainability() {
    return (
        <div className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={`${styles.heroContainer} container`}>
                    <span className={styles.badge}>Our Commitment</span>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.titleAccent}>Cleaning with a</span>
                        <span className={styles.titleMain}>Conscience</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        At Essence Clean, sustainability isn't just a feature — it's the foundation
                        of everything we do. We believe that cleaner businesses and homes shouldn't cost the earth.
                    </p>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className={styles.missionSection}>
                <div className="container">
                    <div className={styles.missionGrid}>
                        <div className={styles.missionContent}>
                            <span className={styles.sectionBadge}>Our Mission</span>
                            <h2>Creating a <span>Sustainable Future</span></h2>
                            <p>
                                We're on a mission to revolutionize the cleaning industry by proving
                                that effective cleaning products can be both powerful and planet-friendly.
                                Every decision we make — from ingredients to packaging — is guided by
                                our commitment to environmental stewardship.
                            </p>
                            <p>
                                Our goal is simple: deliver premium cleaning solutions that protect
                                your spaces, your staff, your customers, and our planet for generations to come.
                            </p>
                        </div>
                        <div className={styles.missionStats}>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>100%</span>
                                <span className={styles.statLabel}>Plant-Based Ingredients</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>0</span>
                                <span className={styles.statLabel}>Harmful Chemicals</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>90%</span>
                                <span className={styles.statLabel}>Recyclable Packaging</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>50%</span>
                                <span className={styles.statLabel}>Reduced Carbon Footprint</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillars Section */}
            <section className={styles.pillarsSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionBadge}>Our Approach</span>
                        <h2>The <span>Pillars</span> of Our Sustainability</h2>
                        <p>Every aspect of Essence Clean is designed with the planet in mind</p>
                    </div>

                    <div className={styles.pillarsGrid}>
                        <div className={styles.pillarCard}>
                            <div className={styles.pillarIcon}>
                                <FaLeaf />
                            </div>
                            <h3>Natural Ingredients</h3>
                            <p>
                                Our formulas are crafted exclusively from plant-based ingredients,
                                botanical extracts, and essential oils. No synthetic chemicals,
                                no harsh additives — just pure, natural cleaning power.
                            </p>
                        </div>

                        <div className={styles.pillarCard}>
                            <div className={styles.pillarIcon}>
                                <FaRecycle />
                            </div>
                            <h3>Circular Economy</h3>
                            <p>
                                Our refill system reduces single-use plastic by up to 80%.
                                Simply refill your beautiful glass spray bottle with our
                                concentrated refill packs and reduce waste effortlessly.
                            </p>
                        </div>

                        <div className={styles.pillarCard}>
                            <div className={styles.pillarIcon}>
                                <FaWater />
                            </div>
                            <h3>Water-Safe Formula</h3>
                            <p>
                                Our biodegradable formula breaks down naturally without
                                harming aquatic ecosystems. Greywater-safe and approved
                                for eco-conscious businesses and homes.
                            </p>
                        </div>

                        <div className={styles.pillarCard}>
                            <div className={styles.pillarIcon}>
                                <FaSeedling />
                            </div>
                            <h3>Carbon Neutral Goal</h3>
                            <p>
                                We're committed to carbon neutrality by 2025. From local
                                sourcing to optimized logistics, every step is designed
                                to minimize our environmental impact.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packaging Section */}
            <section className={styles.packagingSection}>
                <div className="container">
                    <div className={styles.packagingGrid}>
                        <div className={styles.packagingContent}>
                            <span className={styles.sectionBadge}>Thoughtful Packaging</span>
                            <h2>Designed for <span>Reuse</span></h2>
                            <p>
                                Traditional cleaning products create mountains of plastic waste.
                                We've reimagined packaging from the ground up to be beautiful,
                                functional, and sustainable.
                            </p>

                            <div className={styles.packagingFeatures}>
                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>
                                        <FaBottleDroplet />
                                    </div>
                                    <div className={styles.featureText}>
                                        <h4>Premium Glass Bottles</h4>
                                        <p>Elegant, durable bottles designed to be refilled and reused for years</p>
                                    </div>
                                </div>

                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>
                                        <FaBoxOpen />
                                    </div>
                                    <div className={styles.featureText}>
                                        <h4>Glass Refill Bottles</h4>
                                        <p>Our refills also come in elegant glass bottles — 100% reusable and recyclable</p>
                                    </div>
                                </div>

                                <div className={styles.featureItem}>
                                    <div className={styles.featureIcon}>
                                        <FaTruck />
                                    </div>
                                    <div className={styles.featureText}>
                                        <h4>Eco-Friendly Shipping</h4>
                                        <p>100% recycled and recyclable packaging materials for all orders</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.packagingVisual}>
                            <div className={styles.visualCard}>
                                <div className={styles.visualNumber}>100%</div>
                                <p>Glass packaging for both spray bottles and refills — zero plastic waste</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className={styles.impactSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionBadge}>Our Impact</span>
                        <h2>Together, We're Making a <span>Difference</span></h2>
                        <p>Every bottle of Essence Clean contributes to a healthier planet</p>
                    </div>

                    <div className={styles.impactGrid}>
                        <div className={styles.impactCard}>
                            <div className={styles.impactIcon}>
                                <FaRecycle />
                            </div>
                            <div className={styles.impactNumber}>10,000+</div>
                            <p>Plastic bottles saved from landfills through our refill program</p>
                        </div>

                        <div className={styles.impactCard}>
                            <div className={styles.impactIcon}>
                                <FaEarthAmericas />
                            </div>
                            <div className={styles.impactNumber}>5 Tons</div>
                            <p>CO2 emissions reduced through local sourcing and manufacturing</p>
                        </div>

                        <div className={styles.impactCard}>
                            <div className={styles.impactIcon}>
                                <FaHandHoldingHeart />
                            </div>
                            <div className={styles.impactNumber}>1%</div>
                            <p>Of every purchase donated to environmental conservation efforts</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Commitment Section */}
            <section className={styles.commitmentSection}>
                <div className="container">
                    <div className={styles.commitmentContent}>
                        <h2>Our <span>Ongoing Commitment</span></h2>
                        <p>
                            Sustainability is a journey, not a destination. We're constantly
                            innovating and improving our practices to reduce our environmental
                            footprint even further.
                        </p>

                        <div className={styles.commitmentList}>
                            <div className={styles.commitmentItem}>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Cruelty-free and never tested on animals</span>
                            </div>
                            <div className={styles.commitmentItem}>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Vegan-friendly formulations</span>
                            </div>
                            <div className={styles.commitmentItem}>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Partnership with environmental NGOs</span>
                            </div>
                            <div className={styles.commitmentItem}>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Transparent ingredient sourcing</span>
                            </div>
                            <div className={styles.commitmentItem}>
                                <div className={styles.checkIcon}>✓</div>
                                <span>Energy-efficient manufacturing facilities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <div className={styles.ctaContent}>
                        <h2>Join the Clean Revolution</h2>
                        <p>
                            Make a choice that's good for your business or home and great for the planet.
                            Every Essence Clean product is a step towards a more sustainable future.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link href="/products" className={styles.ctaPrimary}>
                                Shop Now
                                <FaArrowRight />
                            </Link>
                            <Link href="/contact" className={styles.ctaSecondary}>
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
