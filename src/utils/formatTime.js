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
