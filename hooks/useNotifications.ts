import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, isAfter, parse, isSameDay } from 'date-fns';

// Add this type definition
type Activity = {
  name: string;
  date: string;
  description: string;
  isAcademic?: boolean;
};

export const useNotifications = () => {
  const [lastNotificationDate, setLastNotificationDate] = useState<string | null>(null);
  const [notificationData, setNotificationData] = useState({ regularActivities: '', academicActivities: '' });
  const [isNotificationVisible, setIsNotificationVisible] = useState<boolean>(false);

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
        const regularActivities = upcomingActivities.filter(a => !a.isAcademic);
        const academicActivities = upcomingActivities.filter(a => a.isAcademic);

        setNotificationData({
          regularActivities: regularActivities.map(a => a.name).join(', ') || 'demo',
          academicActivities: academicActivities.map(a => a.name).join(', ') || 'demo'
        });
        setIsNotificationVisible(true);
        setLastNotificationDate(now.toISOString());
        localStorage.setItem('lastNotificationDate', now.toISOString());
      }
    }
  }, [lastNotificationDate]);
  const closeNotification = () => {
    setIsNotificationVisible(false);
  };

  return {
    checkUpcomingEvents,
    notificationData,
    isNotificationVisible,
    closeNotification
  };
};
