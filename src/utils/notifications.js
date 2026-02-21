export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function scheduleReminder(title, body, tag) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      tag,
      icon: '/logo192.png',
      badge: '/logo192.png',
    });
  }
}

export function setupDailyReminders(morningTime, eveningTime, enabled) {
  // Clear any existing reminder intervals
  if (window._reminderIntervals) {
    window._reminderIntervals.forEach(id => clearInterval(id));
  }
  window._reminderIntervals = [];

  if (!enabled) return;

  const checkAndNotify = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (currentTime === morningTime) {
      scheduleReminder(
        'Morning Affirmation Reminder',
        'Start your day with positivity! Say your affirmations out loud.',
        'morning-reminder'
      );
    }

    if (currentTime === eveningTime) {
      scheduleReminder(
        'Evening Affirmation Reminder',
        'End your day on a positive note! Review and say your affirmations.',
        'evening-reminder'
      );
    }
  };

  // Check every minute
  const intervalId = setInterval(checkAndNotify, 60000);
  window._reminderIntervals = [intervalId];

  // Also check immediately
  checkAndNotify();
}
