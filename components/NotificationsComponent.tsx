// File: /components/NotificationsComponent.tsx
"use client"

import React from 'react';
import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  seen: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data: Notification[] = await response.json();
      console.log('Fetched notifications:', data);
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsSeen = useCallback(async (id: string) => {
    try {
      console.log('Marking notification as seen:', id);
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to mark notification as seen');
      }
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== id)
      );
    } catch (err) {
      console.error('Error marking notification as seen:', err);
    }
  }, []);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refreshNotifications,
    markAsSeen
  };
}

const NotificationsComponent: React.FC = () => {
  const { notifications, loading, error, refreshNotifications, markAsSeen } = useNotifications();

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Notifications</h2>
      <button onClick={refreshNotifications}>Refresh</button>
      {notifications.length === 0 ? (
        <p>No new notifications at this time.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <strong>{notification.title}</strong>: {notification.message}
              <button
                onClick={() => markAsSeen(notification.id)}
                className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Mark as seen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsComponent;