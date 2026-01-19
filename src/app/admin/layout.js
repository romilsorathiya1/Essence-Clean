'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/Admin.module.css';
import { FaGauge, FaBox, FaCartShopping, FaEnvelope, FaRightFromBracket } from 'react-icons/fa6';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Skip layout for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false);
            return;
        }

        // Check authentication
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/me');
                const data = await response.json();

                if (data.success) {
                    setUser(data.data);
                } else {
                    router.push('/admin/login');
                }
            } catch (error) {
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [isLoginPage, router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Render login page without layout
    if (isLoginPage) {
        return children;
    }

    // Show loading while checking auth
    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    // Render admin layout
    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>
                    <h2>Essence Clean</h2>
                    <span>Admin Panel</span>
                </div>

                <nav className={styles.sidebarNav}>
                    <Link
                        href="/admin"
                        className={`${styles.navItem} ${pathname === '/admin' ? styles.active : ''}`}
                    >
                        <FaGauge />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/products"
                        className={`${styles.navItem} ${pathname === '/admin/products' ? styles.active : ''}`}
                    >
                        <FaBox />
                        <span>Products</span>
                    </Link>
                    <Link
                        href="/admin/orders"
                        className={`${styles.navItem} ${pathname === '/admin/orders' ? styles.active : ''}`}
                    >
                        <FaCartShopping />
                        <span>Orders</span>
                    </Link>
                    <Link
                        href="/admin/messages"
                        className={`${styles.navItem} ${pathname === '/admin/messages' ? styles.active : ''}`}
                    >
                        <FaEnvelope />
                        <span>Messages</span>
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <FaRightFromBracket />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
