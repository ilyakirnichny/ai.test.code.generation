/**
 * ============================================
 * FILE: src/fixtures/checkoutTestData.ts
 * PURPOSE: Test data for the checkout flow (Exercise 2)
 *
 * Centralises all checkout-related test data.
 * Tests must never hardcode credentials, product names or totals.
 * ============================================
 */

export interface SauceCredentials {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zip: string;
}

export interface ProductData {
  name: string;
  price: string; // e.g. '$29.99'
}

/**
 * Standard user — full access to the store.
 */
export const sauceStandardUser: SauceCredentials = {
  username: 'standard_user',
  password: 'secret_sauce',
};

/**
 * Products to use in cart/checkout scenarios.
 */
export const sauceProducts: Record<string, ProductData> = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: '$29.99',
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
  },
};

/**
 * Checkout personal info used in the checkout form.
 */
export const checkoutInfo: CheckoutInfo = {
  firstName: 'Test',
  lastName: 'User',
  zip: '12345',
};
