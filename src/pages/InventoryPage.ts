/**
 * ============================================
 * FILE: src/pages/InventoryPage.ts
 * PURPOSE: Inventory (product list) Page Object — saucedemo.com
 *          Equivalent to SearchPage in the exercise template.
 *
 * Follows the same conventions as CheckboxesPage:
 *  - extends BasePage, absolute pageUrl
 *  - private readonly shared locators in constructor
 *  - parameterised methods (productName) instead of hardcoded indices
 *  - assertXxx() methods — no inline expect in tests
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  protected pageUrl = 'https://www.saucedemo.com/inventory.html';

  // All product containers
  private readonly inventoryItems: Locator;
  // Page title — used to confirm the page is loaded
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = this.page.locator('.inventory_item');
    this.pageTitle      = this.page.locator('.title');
  }

  /**
   * Waits for inventory items to be visible before any interaction.
   */
  protected async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.pageTitle);
    this.logger.debug('Inventory page loaded');
  }

  /**
   * Returns a locator scoped to the product card that contains the given name.
   * Used internally to scope add-to-cart and price lookups to a specific product.
   * @param productName - Visible product name, e.g. 'Sauce Labs Backpack'
   */
  private getProductCard(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }

  /**
   * Returns the price text for a given product.
   * @param productName - Visible product name
   */
  public async getProductPrice(productName: string): Promise<string> {
    return (await this.getProductCard(productName)
      .locator('.inventory_item_price')
      .textContent() ?? '').trim();
  }

  /**
   * Clicks "Add to cart" for the specified product.
   * @param productName - Visible product name
   */
  public async addToCart(productName: string): Promise<void> {
    this.logger.step(`Adding to cart: "${productName}"`);
    await this.getProductCard(productName)
      .locator('button[data-test^="add-to-cart"]')
      .click();
  }

  /**
   * Returns the total number of products listed on the page.
   */
  public async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  /**
   * Asserts the inventory page title is visible — confirms the user is logged in.
   */
  public async assertPageVisible(): Promise<void> {
    this.logger.step('Asserting inventory page is visible');
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText('Products');
  }

  /**
   * Asserts that the "Add to cart" button for the given product becomes
   * "Remove" after being clicked — confirming the item was added.
   * @param productName - Visible product name
   */
  public async assertAddedToCart(productName: string): Promise<void> {
    this.logger.step(`Asserting "${productName}" was added to cart`);
    await expect(
      this.getProductCard(productName).locator('button[data-test^="remove"]')
    ).toBeVisible();
  }
}
