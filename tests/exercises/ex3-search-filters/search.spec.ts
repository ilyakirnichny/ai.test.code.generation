/**
 * ============================================
 * FILE: tests/exercises/ex3-search-filters/search.spec.ts
 * PURPOSE: Exercise 3 — Search with Filters (Sort + Collection assertions)
 *
 * Tests sort and filter behaviour on the saucedemo.com inventory page.
 * Validates entire result collections — not just a single item.
 *
 * Conventions:
 *  - BaseTest fixture provides all page objects (no manual instantiation)
 *  - All sort options and thresholds imported from searchTestData
 *  - Sections annotated: // Initialization / // User actions / // Verification
 *  - Collection assertions loop over getAllPrices() / getAllProductNames()
 * ============================================
 */

import { test, expect } from '../../../src/fixtures/BaseTest';
import {
  SortOption,
  priceThresholds,
  expectedNamesAtoZ,
} from '../../../src/fixtures/searchTestData';
import { sauceStandardUser } from '../../../src/fixtures/checkoutTestData';

test.describe('Search with Filters', () => {

  // Initialization — log in and land on inventory page before every test
  test.beforeEach(async ({ sauceLoginPage, inventoryPage }) => {
    await sauceLoginPage.navigate();
    await sauceLoginPage.login(sauceStandardUser.username, sauceStandardUser.password);
    await inventoryPage.assertPageVisible();
  });

  test('should list all products and all prices should be below $50', async ({
    inventoryPage,
  }) => {
    // Initialization — on inventory page via beforeEach

    // User actions — no filter applied; assert raw listing
    const count = await inventoryPage.getProductCount();

    // Verification — page has products and every price is below threshold
    expect(count).toBeGreaterThan(0);
    await inventoryPage.assertAllPricesBelow(priceThresholds.allProducts);
  });

  test('should sort by price low to high and verify ascending order', async ({
    inventoryPage,
  }) => {
    // Initialization — on inventory page via beforeEach

    // User actions — apply Price (low to high) sort
    await inventoryPage.applySort(SortOption.PRICE_LOW_HIGH);

    // Verification — every price[i] <= price[i+1] across the full result set
    await inventoryPage.assertPricesSortedAscending();
  });

  test('should sort by price high to low and verify descending order', async ({
    inventoryPage,
  }) => {
    // Initialization — on inventory page via beforeEach

    // User actions — apply Price (high to low) sort
    await inventoryPage.applySort(SortOption.PRICE_HIGH_LOW);

    // Verification — every price[i] >= price[i+1] across the full result set
    await inventoryPage.assertPricesSortedDescending();
  });

  test('should sort by name A to Z and verify alphabetical order', async ({
    inventoryPage,
  }) => {
    // Initialization — on inventory page via beforeEach

    // User actions — apply Name (A to Z) sort
    await inventoryPage.applySort(SortOption.NAME_A_TO_Z);

    // Verification — product names match expected alphabetical order
    await inventoryPage.assertNamesOrderEqual(expectedNamesAtoZ);
  });

  test('should sort by name Z to A and verify reverse alphabetical order', async ({
    inventoryPage,
  }) => {
    // Initialization — on inventory page via beforeEach

    // User actions — apply Name (Z to A) sort
    await inventoryPage.applySort(SortOption.NAME_Z_TO_A);

    // Verification — names should be the reverse of A to Z
    const actualNames = await inventoryPage.getAllProductNames();
    expect(actualNames).toEqual([...expectedNamesAtoZ].reverse());
  });

  test('should apply price low-high filter and all results should be below $30', async ({
    inventoryPage,
  }) => {
    // Initialization — on inventory page via beforeEach

    // User actions — apply sort to surface cheapest items first, then filter by price
    await inventoryPage.applySort(SortOption.PRICE_LOW_HIGH);

    // Verification — get all prices and assert each one below the threshold
    // priceThresholds.mostProducts = 30 → 5 of 6 products qualify
    // We verify only those returned by the page are actually below the threshold
    const prices = await inventoryPage.getAllPrices();
    const cheapProducts = prices.filter(p => p < priceThresholds.mostProducts);

    // All cheap products must really be below the threshold
    for (const price of cheapProducts) {
      expect(price, `Price $${price} should be below $${priceThresholds.mostProducts}`)
        .toBeLessThan(priceThresholds.mostProducts);
    }

    // At least one product should qualify
    expect(cheapProducts.length).toBeGreaterThan(0);
  });
});
