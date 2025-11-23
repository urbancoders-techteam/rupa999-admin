// ----------------------------------------------------------------------

/**
 * Converts snake_case or kebab-case to Title Case
 * Example: "single_digit" -> "Single Digit"
 * Example: "single-digit" -> "Single Digit"
 * Example: "singleDigit" -> "Single Digit"
 */
export function fTitleCase(text) {
  if (!text) return '';
  
  return text
    .toString()
    // Replace underscores and hyphens with spaces
    .replace(/[_-]/g, ' ')
    // Split by spaces and capitalize each word
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formats bid table digit value
 * Converts snake_case to Title Case and capitalizes
 * Example: "single_digit" -> "Single Digit"
 * Example: "123" -> "123"
 * Example: "abc" -> "Abc"
 */
export function fBidDigit(digit) {
  if (!digit) return '—';
  
  const digitStr = digit.toString();
  
  // If it contains underscores or hyphens, convert to title case
  if (digitStr.includes('_') || digitStr.includes('-')) {
    return fTitleCase(digitStr);
  }
  
  // Otherwise, just capitalize the first letter
  return digitStr.charAt(0).toUpperCase() + digitStr.slice(1).toLowerCase();
}

