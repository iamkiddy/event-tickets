import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface FormattedDate {
  fullDate: string;
  month: string;
  day: string;
}



export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
    day: date.getDate().toString(),
    fullDate: date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  };
};


export const formatTime = (timeString: string | undefined): string => {
  if (!timeString) return '';
  
  // Parse the time string
  const [hours, minutes] = timeString.split(':');
  const hourNum = parseInt(hours);
  
  // Convert to 12-hour format
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const displayHours = hourNum % 12 || 12;
  
  return `${displayHours}:${minutes} ${period}`;
};


export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};


export const formatDate2 = (dateString: string | undefined): FormattedDate => {
  if (!dateString) {
    return {
      fullDate: '',
      month: '',
      day: '',
    };
  }
  
  try {
    const date = new Date(dateString);
    return {
      fullDate: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
    };
  } catch {
    return {
      fullDate: '',
      month: '',
      day: '',
    };
  }
};