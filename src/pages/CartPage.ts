/**
 * ============================================
 * FILE: src/pages/CartPage.ts
 * PURPOSE: Shopping cart Page Object — saucedemo.com
 *
 * Follows same conventions as InventoryPage and CheckboxesPage.
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  protected pageUrl = 'https://www.saucedemo.com/cart.html';

  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems      = this.page.locator('.cart_item');
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.pageTitle      = this.page.locator('.title');
  }

  /**
   * Waits for the cart page title to be visible.
   */
  protected async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.pageTitle);
    this.logger.debug('Cart page loaded');
  }

  /**
   * Returns the number of items currently in the cart.
   */
  public async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /**
   * Returns the names of all items in the cart.
   */
  public async getCartItemNames(): Promise<string[]> {
    return this.cartItems.locator('.inventory_item_name').allInnerTexts();
  }

  /**
   * Clicks the Checkout button to proceed to checkout info.
   */
  public async proceedToCheckout(): Promise<void> {
    this.logger.step('Proceeding to checkout');
    await this.clickElement(this.checkoutButton, 'checkout button');
  }

  /**
   * Asserts the cart contains an item with the given name.
   * @param productName - Expected product name in the cart
   */
  public async assertContainsItem(productName: string): Promise<void> {
    this.logger.step(`Asserting cart contains "${productName}"`);
    await expect(
      this.cartItems.filter({ hasText: productName })
    ).toBeVisible();
  }

  /**
   * Asserts the total number of items in the cart.
   * @param expected - Expected item count
   */
  public async assertItemCount(expected: number): Promise<void> {
    this.logger.step(`Asserting cart has ${expected} item(s)`);
    await expect(this.cartItems).toHaveCount(expected);
  }
}
