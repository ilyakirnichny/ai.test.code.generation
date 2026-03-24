/**
 * ============================================
 * FILE: tests/exercises/ex2-checkout-flow/checkout.spec.ts
 * PURPOSE: Exercise 2 — Checkout Flow (Cart + Total)
 *
 * Tests the full multi-step checkout flow on saucedemo.com:
 *   Login → Inventory → Cart → Checkout Info → Order Summary → Confirm
 *
 * Conventions:
 *  - BaseTest fixtures provide all page objects (no manual instantiation)
 *  - CartBadge is a component instantiated from the shared `page` fixture
 *  - All test data imported from checkoutTestData — nothing hardcoded
 *  - Sections annotated: // Initialization / // User actions / // Verification
 * ============================================
 */

import { test, expect } from '../../../src/fixtures/BaseTest';
import { CartBadge } from '../../../src/components/CartBadge';
import {
  sauceStandardUser,
  sauceProducts,
  checkoutInfo,
} from '../../../src/fixtures/checkoutTestData';

test.describe('Checkout Flow', () => {

  // Initialization — log in before every test so each starts on the inventory page
  test.beforeEach(async ({ sauceLoginPage, inventoryPage }) => {
    await sauceLoginPage.navigate();
    await sauceLoginPage.login(sauceStandardUser.username, sauceStandardUser.password);
    await inventoryPage.assertPageVisible();
  });

  test('should add a product to cart and increment the cart badge', async ({
    page,
    inventoryPage,
  }) => {
    // Initialization — logged in and on inventory page via beforeEach
    const cartBadge = new CartBadge(page);

    // Verification — badge starts at 0 (no badge shown)
    await cartBadge.assertBadgeCount(0);

    // User actions — add one product
    await inventoryPage.addToCart(sauceProducts.backpack.name);

    // Verification — badge incremented to 1
    await cartBadge.assertBadgeCount(1);
    await inventoryPage.assertAddedToCart(sauceProducts.backpack.name);
  });

  test('should add two products and show badge count of 2', async ({
    page,
    inventoryPage,
  }) => {
    // Initialization — logged in via beforeEach
    const cartBadge = new CartBadge(page);

    // User actions — add both products
    await inventoryPage.addToCart(sauceProducts.backpack.name);
    await inventoryPage.addToCart(sauceProducts.bikeLight.name);

    // Verification
    await cartBadge.assertBadgeCount(2);
  });

  test('should show added product in the cart', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    // Initialization — logged in via beforeEach
    const cartBadge = new CartBadge(page);

    // User actions — add product, then navigate to cart via badge
    await inventoryPage.addToCart(sauceProducts.backpack.name);
    await cartBadge.clickCart();

    // Verification — product is in the cart
    await cartPage.assertContainsItem(sauceProducts.backpack.name);
    await cartPage.assertItemCount(1);
  });

  test('should complete full checkout flow and verify order total', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    orderSummaryPage,
  }) => {
    // Initialization — logged in via beforeEach
    const cartBadge = new CartBadge(page);

    // User actions — add two products to cart
    await inventoryPage.addToCart(sauceProducts.backpack.name);
    await inventoryPage.addToCart(sauceProducts.bikeLight.name);

    // Verification — badge shows 2 items
    await cartBadge.assertBadgeCount(2);

    // User actions — navigate to cart and proceed to checkout
    await cartBadge.clickCart();
    await cartPage.assertContainsItem(sauceProducts.backpack.name);
    await cartPage.assertContainsItem(sauceProducts.bikeLight.name);
    await cartPage.proceedToCheckout();

    // User actions — fill checkout info form
    await checkoutInfoPage.assertPageVisible();
    await checkoutInfoPage.fillAndContinue(checkoutInfo);

    // Verification — order summary shows correct item total and grand total
    // backpack $29.99 + bike light $9.99 = $39.98 item total; total = $43.18 incl. 8% tax
    await orderSummaryPage.assertPageVisible();
    await orderSummaryPage.assertItemTotalContains('$39.98');
    await orderSummaryPage.assertTotalContains('$43.18');

    // User actions — place the order
    await orderSummaryPage.finish();

    // Verification — order confirmation shown
    await orderSummaryPage.assertOrderComplete();
  });
});
