import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, isAfter, parse } from 'date-fns';

// Add this type definition
type Activity = {
  name: string;
  date: string;
  description: string;
};

export const useNotifications = () => {
  const [lastNotificationDate, setLastNotificationDate] = useState<string | null>(null);

  const checkUpcomingEvents = useCallback((activities: Activity[], initialCheck = false) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= now && activityDate <= tomorrow;
    });

    if (upcomingActivities.length > 0) {
      showNotification(upcomingActivities, initialCheck);
    }
  }, []);

  const showNotification = (activities: Activity[], initialCheck: boolean) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        createNotification(activities);
      } else if (Notification.permission !== 'denied' || initialCheck) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            createNotification(activities);
          }
        });
      }
    } else {
      // Fallback for browsers that don't support notifications
      console.log('Notifications not supported in this browser');
      alert(`Upcoming activities: ${activities.map(a => a.name).join(', ')}`);
    }
  };

  const createNotification = (activities: Activity[]) => {
    try {
      const title = 'Upcoming Activities';
      const options = {
        body: activities.map(a => `${a.name} on ${a.date}`).join('\n'),
        icon: '/icon.png' // Make sure this path is correct
      };

      new Notification(title, options);
    } catch (error) {
      console.error('Error creating notification:', error);
      // Fallback to alert
      alert(`Upcoming activities: ${activities.map(a => a.name).join(', ')}`);
    }
  };

  return { checkUpcomingEvents };
};
