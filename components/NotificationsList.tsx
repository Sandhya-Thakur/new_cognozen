// File: /components/NotificationsList.tsx
import React from 'react';
import { Notification } from './NotificationsComponent';

interface NotificationsListProps {
  notifications: Notification[];
  onClose: () => void;
  markAsSeen: (id: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ notifications, onClose, markAsSeen }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="py-2">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        {notifications.length === 0 ? (
          <p className="px-4 py-2 text-gray-500">No new notifications at this time.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification.id} className="px-4 py-3 hover:bg-gray-50">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.message}</p>
                <button 
                  onClick={() => markAsSeen(notification.id)}
                  className="mt-2 px-2 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Mark as seen
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsList;