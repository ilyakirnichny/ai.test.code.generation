/**
 * ============================================
 * FILE: src/utils/dateHelper.ts
 * PURPOSE: Date formatting and parsing helpers for test assertions
 *
 * EXERCISE 5 — AFTER STATE (utility fix applied)
 *
 * Three null/undefined guards added — one per function.
 * No other logic, signatures, or structure changed.
 * ============================================
 */

/**
 * Formats a Date or ISO date-string into 'YYYY-MM-DD'.
 * Used in test assertions that compare date fields from the UI.
 *
 * ❌ BUGGY — crashes when value is null or undefined:
 *    formatDate(null)      → TypeError: Cannot read properties of null
 *    formatDate(undefined) → TypeError: Cannot read properties of undefined
 *
 * @param value - A Date object or ISO string, e.g. '2024-03-15T10:30:00Z'
 * @returns Formatted date string 'YYYY-MM-DD', or '' for null/undefined
 */
export function formatDate(value: Date | string | null | undefined): string {
  // ✅ FIXED — null/undefined guard added; all other logic unchanged
  if (value == null) return '';
  const d = value instanceof Date ? value : new Date(value as string);
  return d.toISOString().split('T')[0];
}

/**
 * Converts a Unix timestamp (seconds) to a human-readable 'YYYY-MM-DD' string.
 * Used when API responses return epoch seconds.
 *
 * ❌ BUGGY — crashes when value is null or undefined:
 *    parseTimestamp(null)      → TypeError
 *    parseTimestamp(undefined) → NaN propagation → Invalid Date crash
 *
 * @param value - Unix timestamp in seconds
 * @returns Formatted date string 'YYYY-MM-DD', or '' for null/undefined
 */
export function parseTimestamp(value: number | null | undefined): string {
  // ✅ FIXED — null/undefined guard added; all other logic unchanged
  if (value == null) return '';
  const d = new Date((value as number) * 1000);
  return d.toISOString().split('T')[0];
}

/**
 * Returns the number of full calendar days between two dates (|a - b|).
 * Used to verify "expiry in N days" or "created N days ago" UI labels.
 *
 * ❌ BUGGY — crashes when either argument is null or undefined:
 *    daysBetween(null, new Date()) → TypeError
 *    daysBetween(new Date(), null) → TypeError
 *
 * @param a - First date (Date or ISO string)
 * @param b - Second date (Date or ISO string)
 * @returns Absolute difference in full days, or 0 if either input is null/undefined
 */
export function daysBetween(
  a: Date | string | null | undefined,
  b: Date | string | null | undefined,
): number {
  // ✅ FIXED — null/undefined guard added; all other logic unchanged
  if (a == null || b == null) return 0;
  const dateA = a instanceof Date ? a : new Date(a as string);
  const dateB = b instanceof Date ? b : new Date(b as string);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(Math.floor((dateA.getTime() - dateB.getTime()) / msPerDay));
}

/**
 * Returns true if the given date string represents today's date.
 * ✅ Already handles null/undefined — included as a correct reference example.
 *
 * @param value - ISO date string, or null/undefined
 */
export function isToday(value: Date | string | null | undefined): boolean {
  if (value == null) return false;
  const today = new Date().toISOString().split('T')[0];
  const input = value instanceof Date ? value.toISOString().split('T')[0] : String(value).split('T')[0];
  return today === input;
}
