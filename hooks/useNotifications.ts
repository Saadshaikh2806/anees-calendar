import { useState, useEffect } from 'react';
import { format, parseISO, isAfter, parse } from 'date-fns';

// Add this type definition
type Activity = {
  name: string;
  date: string;
  description: string;
};

export function useNotifications() {
  const [lastNotificationDate, setLastNotificationDate] = useState<string | null>(null);

  function checkUpcomingEvents(activities: Activity[], forceCheck: boolean = false) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = format(tomorrow, 'yyyy-MM-dd');
    
    const tomorrowsActivities = activities.filter(activity => activity.date === tomorrowString);
    
    if (tomorrowsActivities.length > 0) {
      const shouldShowNotification = forceCheck || 
        !lastNotificationDate || 
        isAfter(now, parse(lastNotificationDate, 'yyyy-MM-dd', new Date()));

      if (shouldShowNotification) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
          Notification.requestPermission();
        }

        tomorrowsActivities.forEach(activity => {
          showNotification(activity);
        });

        setLastNotificationDate(format(now, 'yyyy-MM-dd'));
      }
    }
  }

  function showNotification(activity: Activity) {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      const options = {
        body: `📅 ${activity.name}\n\n🕒 ${format(parseISO(activity.date), 'MMMM d, yyyy')}\n\n📝 ${activity.description}`,
        icon: '/notification-icon.webp',
        badge: '/badge-icon.webp',
        image: '/event-image.webp',
        vibrate: [200, 100, 200],
        tag: `event-${activity.date}`,
        // Remove the actions property
      };

      const notification = new Notification("📢 Upcoming Event Tomorrow!", options);

      notification.onclick = function() {
        window.focus();
        // Add your logic here to show event details
        notification.close();
      };
    }
  }

  return { checkUpcomingEvents };
}
