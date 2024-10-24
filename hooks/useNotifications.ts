import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, isAfter, parse, isSameDay } from 'date-fns';

// Add this type definition
type Activity = {
  name: string;
  date: string;
  description: string;
};

export const useNotifications = () => {
  const [lastNotificationDate, setLastNotificationDate] = useState<string | null>(null);

  const checkUpcomingEvents = useCallback((activities: Activity[]) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= now && activityDate <= tomorrow;
    });

    if (upcomingActivities.length > 0) {
      const lastNotification = lastNotificationDate ? new Date(lastNotificationDate) : null;
      const shouldNotify = !lastNotification || !isSameDay(lastNotification, now);

      if (shouldNotify) {
        showNotification(upcomingActivities);
        setLastNotificationDate(now.toISOString());
        localStorage.setItem('lastNotificationDate', now.toISOString());
      }
    }
  }, [lastNotificationDate]);

  const showNotification = (activities: Activity[]) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        createNotification(activities);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            createNotification(activities);
          }
        });
      }
    } else {
      console.log('Notifications not supported in this browser');
      alert(`Upcoming activities: ${activities.map(a => a.name).join(', ')}`);
    }
  };

  const createNotification = (activities: Activity[]) => {
    try {
      const title = 'Upcoming Activities';
      const options = {
        body: activities.map(a => `${a.name} on ${a.date}`).join('\n'),
        icon: '/icon.png'
      };

      new Notification(title, options);
    } catch (error) {
      console.error('Error creating notification:', error);
      alert(`Upcoming activities: ${activities.map(a => a.name).join(', ')}`);
    }
  };

  useEffect(() => {
    const storedDate = localStorage.getItem('lastNotificationDate');
    if (storedDate) {
      setLastNotificationDate(storedDate);
    }
  }, []);

  return { checkUpcomingEvents };
};
