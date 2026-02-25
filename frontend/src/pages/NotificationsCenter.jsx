import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './NotificationsCenter.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function NotificationsCenter() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        if (user) {
            loadNotifications();
            loadUnreadCount();
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to load notifications');
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Load notifications error:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/notifications/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to load count');
            const data = await response.json();
            setUnreadCount(data.count || 0);
        } catch (error) {
            console.error('Load unread count error:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/notifications/${id}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to mark as read');
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
            toast.success('Marked as read');
        } catch (error) {
            console.error('Mark as read error:', error);
            toast.error('Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to mark all as read');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            toast.success('All marked as read');
        } catch (error) {
            console.error('Mark all as read error:', error);
            toast.error('Failed to mark all as read');
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete');
            setNotifications(notifications.filter(n => n.id !== id));
            toast.success('Notification deleted');
        } catch (error) {
            console.error('Delete notification error:', error);
            toast.error('Failed to delete notification');
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.is_read;
        if (filter === 'read') return n.is_read;
        return true;
    });

    const getNotificationIcon = (type) => {
        const icons = {
            order: '📦',
            payment: '💳',
            shipping: '🚚',
            return: '↩️',
            stock: '📊',
            promotion: '🎉',
            system: '⚙️'
        };
        return icons[type] || '🔔';
    };

    if (loading) {
        return (
            <div className="notifications-loading">
                <div className="spinner"></div>
                <p>Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="notifications-center">
            <div className="notifications-header">
                <div className="header-left">
                    <h1>🔔 Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount} unread</span>
                    )}
                </div>
                <div className="header-actions">
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="btn-mark-all">
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            <div className="notifications-filters">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All ({notifications.length})
                </button>
                <button
                    className={filter === 'unread' ? 'active' : ''}
                    onClick={() => setFilter('unread')}
                >
                    Unread ({unreadCount})
                </button>
                <button
                    className={filter === 'read' ? 'active' : ''}
                    onClick={() => setFilter('read')}
                >
                    Read ({notifications.length - unreadCount})
                </button>
            </div>

            <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                    <div className="no-notifications">
                        <div className="empty-icon">🔔</div>
                        <h3>No notifications</h3>
                        <p>You're all caught up!</p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                        >
                            <div className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <span className="notification-time">
                                    {new Date(notification.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="notification-actions">
                                {!notification.is_read && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="btn-mark-read"
                                        title="Mark as read"
                                    >
                                        ✓
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="btn-delete"
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
