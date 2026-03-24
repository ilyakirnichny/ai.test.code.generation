# Exercise 5 — Utility Fix: `dateHelper.ts`

## Objective

Identify and fix three crashing null/undefined bugs in `src/utils/dateHelper.ts`  
without changing any other logic, signature, or project structure.

---

## Prompt Used

```
src/utils/dateHelper.ts contains three utility functions that crash when passed
null or undefined: formatDate, parseTimestamp, and daysBetween.

Add a null/undefined guard to each function:
- formatDate   → return '' for null/undefined
- parseTimestamp → return '' for null/undefined
- daysBetween  → return 0 if either argument is null/undefined

Keep all other behaviour, signatures, and structure exactly as-is.
Use isToday (already correct) as a reference for the guard pattern.
Only modify these three functions — nothing else.
```

---

## Before / After

### `formatDate`

```typescript
// BEFORE — crashes on null/undefined
export function formatDate(value: Date | string | null | undefined): string {
  const d = value instanceof Date ? value : new Date(value as string);
  return d.toISOString().split('T')[0];
}

// AFTER — one guard line added
export function formatDate(value: Date | string | null | undefined): string {
  if (value == null) return '';          // ← FIX
  const d = value instanceof Date ? value : new Date(value as string);
  return d.toISOString().split('T')[0];
}
```

### `parseTimestamp`

```typescript
// BEFORE — crashes on null/undefined
export function parseTimestamp(value: number | null | undefined): string {
  const d = new Date((value as number) * 1000);
  return d.toISOString().split('T')[0];
}

// AFTER — one guard line added
export function parseTimestamp(value: number | null | undefined): string {
  if (value == null) return '';          // ← FIX
  const d = new Date((value as number) * 1000);
  return d.toISOString().split('T')[0];
}
```

### `daysBetween`

```typescript
// BEFORE — crashes when either argument is null/undefined
export function daysBetween(
  a: Date | string | null | undefined,
  b: Date | string | null | undefined
): number {
  const dateA = a instanceof Date ? a : new Date(a as string);
  const dateB = b instanceof Date ? b : new Date(b as string);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(Math.floor((dateA.getTime() - dateB.getTime()) / msPerDay));
}

// AFTER — one guard line added
export function daysBetween(
  a: Date | string | null | undefined,
  b: Date | string | null | undefined
): number {
  if (a == null || b == null) return 0;  // ← FIX
  const dateA = a instanceof Date ? a : new Date(a as string);
  const dateB = b instanceof Date ? b : new Date(b as string);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(Math.floor((dateA.getTime() - dateB.getTime()) / msPerDay));
}
```

---

## Test Results

| Suite | Tests | Result |
|---|---|---|
| `formatDate` — edge cases (null/undefined guard) | 2 | ✅ passed |
| `formatDate` — normal cases (behaviour unchanged) | 3 | ✅ passed |
| `parseTimestamp` — edge cases | 2 | ✅ passed |
| `parseTimestamp` — normal cases | 2 | ✅ passed |
| `daysBetween` — edge cases | 4 | ✅ passed |
| `daysBetween` — normal cases | 4 | ✅ passed |
| `isToday` — reference function (unchanged) | 4 | ✅ passed |
| **Total** | **21** | **✅ all passed** |

---

## Key Decisions

| Decision | Rationale |
|---|---|
| `== null` instead of `=== null && === undefined` | Covers both `null` and `undefined` with one check — idiomatic TypeScript |
| Return `''` for string functions, `0` for numeric functions | Matches the existing `isToday` pattern (`return false`) — safe, predictable sentinel |
| No other code changed | Surgical fix keeps the diff minimal and avoids introducing new bugs |
| `isToday` included as reference example | Shows Copilot the guard pattern that was already correct |
