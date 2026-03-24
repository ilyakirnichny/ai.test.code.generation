/**
 * ============================================
 * FILE: src/fixtures/searchTestData.ts
 * PURPOSE: Test data for the Search with Filters exercise (Exercise 3)
 *
 * Centralises sort options and price thresholds.
 * Tests must never hardcode these values.
 * ============================================
 */

/**
 * Sort options available in the saucedemo.com inventory sort dropdown.
 * Values match the <option value="..."> attributes.
 */
export const SortOption = {
  NAME_A_TO_Z:    'az',
  NAME_Z_TO_A:    'za',
  PRICE_LOW_HIGH: 'lohi',
  PRICE_HIGH_LOW: 'hilo',
} as const;

export type SortOption = typeof SortOption[keyof typeof SortOption];

/**
 * Price filter thresholds used in assertions.
 */
export const priceThresholds = {
  /** All 6 saucedemo products are below this value */
  allProducts: 50,
  /** 5 out of 6 products are below this value (Fleece Jacket $49.99 excluded) */
  mostProducts: 30,
};

/**
 * Expected ordered product names for A→Z sort on saucedemo.
 */
export const expectedNamesAtoZ = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];
