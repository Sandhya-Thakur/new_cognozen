// File: /components/NotificationsBell.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Bell } from "lucide-react";
import { useNotifications } from "./NotificationsComponent";
import NotificationsList from "./NotificationsList";

const NotificationsBell: React.FC = () => {
  const { notifications, markAsSeen, refreshNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Refresh notifications every 5 minutes
    const intervalId = setInterval(() => {
      refreshNotifications();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [refreshNotifications]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refreshNotifications();
    }
  };

  const handleMarkAsSeen = (id: string) => {
    markAsSeen(id);
  };

  const unseenCount = notifications.length;

  return (
    <div className="relative">
      <button 
        onClick={toggleNotifications}
        className="relative w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
      >
        <Bell className="w-5 h-5 text-white" />
        {unseenCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unseenCount}
          </span>
        )}
      </button>
      {isOpen && (
        <NotificationsList 
          notifications={notifications} 
          onClose={() => setIsOpen(false)}
          markAsSeen={handleMarkAsSeen}
        />
      )}
    </div>
  );
};

export default NotificationsBell;