/**
 * ============================================
 * FILE: tests/exercises/ex5-utility-fix/dateHelper.spec.ts
 * PURPOSE: Exercise 5 — Utility Fix
 *
 * Tests for src/utils/dateHelper.ts
 *
 * Tests are split into two groups:
 *   "edge cases" — verify the FIX: null/undefined must return '' or 0
 *   "normal cases" — verify EXISTING behaviour is unchanged after the fix
 *
 * No browser required — pure function tests run with Playwright's test runner.
 * ============================================
 */

import { test, expect } from '@playwright/test';
import {
  formatDate,
  parseTimestamp,
  daysBetween,
  isToday,
} from '../../../src/utils/dateHelper';

// ─────────────────────────────────────────────────────────────────────────────
// formatDate
// ─────────────────────────────────────────────────────────────────────────────
test.describe('formatDate', () => {

  test.describe('edge cases — null/undefined guard (the fix)', () => {
    test('returns empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });

    test('returns empty string for undefined', () => {
      expect(formatDate(undefined)).toBe('');
    });
  });

  test.describe('normal cases — existing behaviour unchanged', () => {
    test('formats a Date object to YYYY-MM-DD', () => {
      expect(formatDate(new Date('2024-03-15T10:30:00Z'))).toBe('2024-03-15');
    });

    test('formats an ISO string to YYYY-MM-DD', () => {
      expect(formatDate('2024-11-01T00:00:00Z')).toBe('2024-11-01');
    });

    test('formats a plain date string to YYYY-MM-DD', () => {
      expect(formatDate('2024-01-20')).toBe('2024-01-20');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// parseTimestamp
// ─────────────────────────────────────────────────────────────────────────────
test.describe('parseTimestamp', () => {

  test.describe('edge cases — null/undefined guard (the fix)', () => {
    test('returns empty string for null', () => {
      expect(parseTimestamp(null)).toBe('');
    });

    test('returns empty string for undefined', () => {
      expect(parseTimestamp(undefined)).toBe('');
    });
  });

  test.describe('normal cases — existing behaviour unchanged', () => {
    test('converts a Unix timestamp to YYYY-MM-DD', () => {
      // 1710460800 = 2024-03-15 00:00:00 UTC
      expect(parseTimestamp(1710460800)).toBe('2024-03-15');
    });

    test('converts epoch 0 to 1970-01-01', () => {
      expect(parseTimestamp(0)).toBe('1970-01-01');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// daysBetween
// ─────────────────────────────────────────────────────────────────────────────
test.describe('daysBetween', () => {

  test.describe('edge cases — null/undefined guard (the fix)', () => {
    test('returns 0 when first argument is null', () => {
      expect(daysBetween(null, new Date('2024-03-15'))).toBe(0);
    });

    test('returns 0 when second argument is null', () => {
      expect(daysBetween(new Date('2024-03-15'), null)).toBe(0);
    });

    test('returns 0 when both arguments are null', () => {
      expect(daysBetween(null, null)).toBe(0);
    });

    test('returns 0 when first argument is undefined', () => {
      expect(daysBetween(undefined, '2024-03-15')).toBe(0);
    });
  });

  test.describe('normal cases — existing behaviour unchanged', () => {
    test('returns correct day count between two Date objects', () => {
      const a = new Date('2024-01-01');
      const b = new Date('2024-01-11');
      expect(daysBetween(a, b)).toBe(10);
    });

    test('returns correct day count between two ISO strings', () => {
      expect(daysBetween('2024-03-01', '2024-03-15')).toBe(14);
    });

    test('is symmetric — order of arguments does not matter', () => {
      const a = '2024-06-01';
      const b = '2024-06-08';
      expect(daysBetween(a, b)).toBe(daysBetween(b, a));
    });

    test('returns 0 for the same date', () => {
      expect(daysBetween('2024-03-15', '2024-03-15')).toBe(0);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isToday — already correct before the fix (reference example)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('isToday (unchanged reference function)', () => {
  test('returns false for null', () => {
    expect(isToday(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isToday(undefined)).toBe(false);
  });

  test('returns true for today\'s date string', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(isToday(today)).toBe(true);
  });

  test('returns false for a past date', () => {
    expect(isToday('2000-01-01')).toBe(false);
  });
});
