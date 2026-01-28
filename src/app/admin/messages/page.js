'use client';

import { useEffect, useState } from 'react';
import styles from '../../../styles/Admin.module.css';
import { FaEnvelope, FaTrash, FaCheck, FaEye, FaXmark } from 'react-icons/fa6';
import CustomSelect from '@/components/CustomSelect';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchMessages = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (searchQuery) queryParams.append('search', searchQuery);
            if (statusFilter !== 'all') queryParams.append('status', statusFilter);

            const response = await fetch(`/api/contact?${queryParams.toString()}`);
            const data = await response.json();

            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [searchQuery, statusFilter]);

    const openMessageModal = async (message) => {
        setSelectedMessage(message);
        setShowModal(true);

        // Mark as read if not already
        if (!message.isRead) {
            try {
                await fetch(`/api/contact/${message.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isRead: true })
                });
                fetchMessages();
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                fetchMessages();
                if (showModal) setShowModal(false);
            } else {
                alert(data.error || 'Failed to delete message');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    };

    const markAsReplied = async (id) => {
        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isReplied: true })
            });

            const data = await response.json();

            if (data.success) {
                fetchMessages();
                if (selectedMessage && selectedMessage.id === id) {
                    setSelectedMessage({ ...selectedMessage, isReplied: true });
                }
            }
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1>Messages</h1>
                <p>Contact form submissions from your website {unreadCount > 0 && `(${unreadCount} unread)`}</p>
            </div>

            <div className={styles.filters} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Search by Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '0.6rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        width: '300px'
                    }}
                />

                <CustomSelect
                    options={[
                        { value: 'all', label: 'All Messages' },
                        { value: 'unread', label: 'Unread' },
                        { value: 'read', label: 'Read' },
                        { value: 'replied', label: 'Replied' }
                    ]}
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    style={{ width: '200px' }}
                />
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2>All Messages ({messages.length})</h2>
                </div>

                {messages.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((message) => (
                                <tr key={message.id} style={{ background: !message.isRead ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                                            {message.isReplied ? (
                                                <span className={`${styles.badge} ${styles.confirmed}`}>Replied</span>
                                            ) : message.isRead ? (
                                                <span className={`${styles.badge} ${styles.read}`}>Read</span>
                                            ) : (
                                                <span className={`${styles.badge} ${styles.unread}`}>Unread</span>
                                            )}
                                        </div>
                                    </td>
                                    <td><strong>{message.name}</strong></td>
                                    <td>{message.email}</td>
                                    <td>{message.subject || 'General Inquiry'}</td>
                                    <td>{formatDate(message.createdAt)}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => openMessageModal(message)}
                                                className={`${styles.actionBtn} ${styles.view}`}
                                                title="View"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(message.id)}
                                                className={`${styles.actionBtn} ${styles.delete}`}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <FaEnvelope />
                        <h3>No messages found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Message Details Modal */}
            {showModal && selectedMessage && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.messageModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.messageModalHeader}>
                            <h2>Message Details</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                                <FaXmark />
                            </button>
                        </div>

                        <div className={styles.messageModalBody}>
                            {/* Sender Information */}
                            <div className={styles.orderModalSection}>
                                <h3 className={styles.sectionTitle}>SENDER INFORMATION</h3>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <label>Name</label>
                                        <p>{selectedMessage.name}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Email Address</label>
                                        <p>{selectedMessage.email}</p>
                                    </div>
                                    {selectedMessage.phone && (
                                        <div className={styles.infoItem}>
                                            <label>Phone Number</label>
                                            <p>{selectedMessage.phone}</p>
                                        </div>
                                    )}
                                    <div className={styles.infoItem}>
                                        <label>Received Date</label>
                                        <p>{formatDate(selectedMessage.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className={styles.orderModalSection}>
                                <h3 className={styles.sectionTitle}>MESSAGE</h3>
                                <div className={styles.messageContentBox}>
                                    <div className={styles.messageSubject}>
                                        <strong>Subject:</strong> {selectedMessage.subject || 'General Inquiry'}
                                    </div>
                                    <div className={styles.messageText}>
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className={styles.orderModalSection}>
                                <h3 className={styles.sectionTitle}>STATUS</h3>
                                <div className={styles.messageStatusInfo}>
                                    <div className={styles.infoItem}>
                                        <label>Read Status</label>
                                        <span className={`${styles.badge} ${selectedMessage.isRead ? styles.read : styles.unread}`}>
                                            {selectedMessage.isRead ? 'Read' : 'Unread'}
                                        </span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Reply Status</label>
                                        <span className={`${styles.badge} ${selectedMessage.isReplied ? styles.confirmed : styles.pending}`}>
                                            {selectedMessage.isReplied ? 'Replied' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.messageModalFooter}>
                            <a
                                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your Inquiry'}`}
                                className={styles.replyBtn}
                                onClick={() => markAsReplied(selectedMessage.id)}
                            >
                                <FaEnvelope />
                                Reply via Email
                            </a>
                            <button
                                onClick={() => handleDelete(selectedMessage.id)}
                                className={styles.deleteMessageBtn}
                            >
                                <FaTrash />
                                Delete Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
