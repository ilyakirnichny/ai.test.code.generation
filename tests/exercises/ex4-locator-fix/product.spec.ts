/**
 * ============================================
 * FILE: tests/exercises/ex4-locator-fix/product.spec.ts
 * PURPOSE: Exercise 4 — Locator Fix
 *
 * Verifies that ProductPage works correctly after the locator fix.
 * Two locators were broken by a UI change:
 *   - addToCartButton: `.btn_primary` → `[data-test^="add-to-cart"]`
 *   - productPrice:   XPath           → `[data-test="inventory-item-price"]`
 *
 * These tests would have FAILED with the old locators and now PASS
 * with the corrected selectors — proving the fix works.
 *
 * Conventions:
 *  - BaseTest fixtures (no manual page instantiation)
 *  - Data from checkoutTestData — no hardcoded values
 *  - Sections: // Initialization / // User actions / // Verification
 * ============================================
 */

import { test, expect } from '../../../src/fixtures/BaseTest';
import { CartBadge } from '../../../src/components/CartBadge';
import { sauceStandardUser, sauceProducts } from '../../../src/fixtures/checkoutTestData';

test.describe('Product Page — Locator Fix Verification', () => {

  // Initialization — login before every test
  test.beforeEach(async ({ sauceLoginPage, inventoryPage }) => {
    await sauceLoginPage.navigate();
    await sauceLoginPage.login(sauceStandardUser.username, sauceStandardUser.password);
    await inventoryPage.assertPageVisible();
  });

  test('should display product name and price on detail page (fixed price locator)', async ({
    inventoryPage,
    productPage,
  }) => {
    // Initialization — on inventory page via beforeEach

    // User actions — open the product detail page
    await inventoryPage.openProductDetail(sauceProducts.backpack.name);

    // Verification — fixed [data-test="inventory-item-price"] locator works
    await productPage.assertNameVisible();
    await productPage.assertPriceVisible();

    const price = await productPage.getProductPrice();
    expect(price).toBe(sauceProducts.backpack.price);
  });

  test('should add product to cart from detail page (fixed add-to-cart locator)', async ({
    page,
    inventoryPage,
    productPage,
  }) => {
    // Initialization — on inventory page via beforeEach
    const cartBadge = new CartBadge(page);

    // Verification — cart is empty before action
    await cartBadge.assertBadgeCount(0);

    // User actions — open detail page and add to cart
    await inventoryPage.openProductDetail(sauceProducts.backpack.name);
    await productPage.addToCart();

    // Verification — fixed [data-test^="add-to-cart"] locator worked: badge now shows 1
    await cartBadge.assertBadgeCount(1);
  });

  test('should navigate back to inventory from product detail page', async ({
    inventoryPage,
    productPage,
  }) => {
    // Initialization — on inventory page via beforeEach

    // User actions — open detail, then navigate back
    await inventoryPage.openProductDetail(sauceProducts.bikeLight.name);
    await productPage.assertNameVisible();
    await productPage.goBack();

    // Verification — back on inventory page
    await inventoryPage.assertPageVisible();
  });

  test('should show correct product name on detail page', async ({
    inventoryPage,
    productPage,
  }) => {
    // Initialization — on inventory page via beforeEach

    // User actions
    await inventoryPage.openProductDetail(sauceProducts.bikeLight.name);

    // Verification
    const name = await productPage.getProductName();
    expect(name).toBe(sauceProducts.bikeLight.name);
  });
});
