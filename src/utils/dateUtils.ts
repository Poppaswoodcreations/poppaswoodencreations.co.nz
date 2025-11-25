/**
 * Date formatting utilities
 */

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-NZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

/**
 * Check if date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if date is this week
 */
export const isThisWeek = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo && date <= today;
};

/**
 * Format business hours
 */
export const formatBusinessHours = (hours: string): string => {
  return hours.replace(/\n/g, '<br>');
};

/**
 * Check if business is currently open (NZ time)
 */
export const isBusinessOpen = (): boolean => {
  const now = new Date();
  const nzTime = new Date(now.toLocaleString("en-US", {timeZone: "Pacific/Auckland"}));
  const day = nzTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = nzTime.getHours();

  // Business hours: Monday-Friday 9AM-3PM NZST
  if (day >= 1 && day <= 5) { // Monday to Friday
    return hour >= 9 && hour < 15; // 9AM to 3PM
  }
  
  return false; // Closed weekends
};

/**
 * Get next business day
 */
export const getNextBusinessDay = (): string => {
  const now = new Date();
  const nzTime = new Date(now.toLocaleString("en-US", {timeZone: "Pacific/Auckland"}));
  
  // If it's Friday after 3PM, next business day is Monday
  // If it's weekend, next business day is Monday
  // Otherwise, next business day is tomorrow (if before 3PM) or day after tomorrow
  
  let nextDay = new Date(nzTime);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // Skip weekends
  while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return formatDate(nextDay.toISOString());
};