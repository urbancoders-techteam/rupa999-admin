import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'DD MMM YYYY';

  return date ? dayjs(date).format(fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'DD MMM YYYY hh:mm A';

  return date ? dayjs(date).format(fm) : '';
}

export function fTimestamp(date) {
  return date ? dayjs(date).valueOf() : '';
}

export function fToNow(date) {
  return date ? dayjs(date).fromNow() : '';
}

// Custom format for transaction table: DD/MMM/YYYY with time on separate line
export function fDateTimeSplit(date) {
  if (!date) return { date: '', time: '' };
  
  const dayjsDate = dayjs(date);
  return {
    date: dayjsDate.format('DD-MMM, YYYY'),
    time: dayjsDate.format('hh:mm A'),
  };
}

export const formatTimeTo12Hour = (timeString) => {
  if (!timeString) return "-";
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(+hour, +minute);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Get ordinal suffix for day (1st, 2nd, 3rd, 4th, etc.)
const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

// Format date with ordinal suffix: "27th Nov, 2025, 10:30 Pm"
export function fDateTimeOrdinal(date) {
  if (!date) return '';
  
  const dayjsDate = dayjs(date);
  const day = dayjsDate.date();
  const ordinalSuffix = getOrdinalSuffix(day);
  
  // Format: Do MMM, YYYY, hh:mm A
  // Note: Do is dayjs format for day with ordinal, but we'll build it manually for more control
  return `${day}${ordinalSuffix} ${dayjsDate.format('MMM, YYYY, hh:mm A')}`;
}
