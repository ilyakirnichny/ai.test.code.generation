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
import { SortOption } from '../fixtures/searchTestData';

export class InventoryPage extends BasePage {
  protected pageUrl = 'https://www.saucedemo.com/inventory.html';

  // All product containers
  private readonly inventoryItems: Locator;
  // Page title — used to confirm the page is loaded
  private readonly pageTitle: Locator;
  // Sort/filter dropdown — <select data-test="product-sort-container">
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = this.page.locator('.inventory_item');
    this.pageTitle      = this.page.locator('.title');
    this.sortDropdown   = this.page.locator('[data-test="product-sort-container"]');
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

  // ── Sort / Filter ──────────────────────────────────────────────────────────

  /**
   * Selects a sort option from the dropdown.
   * Maps to applyFilter() in the exercise template.
   * @param option - One of SortOption constants (e.g. SortOption.PRICE_LOW_HIGH)
   */
  public async applySort(option: SortOption): Promise<void> {
    this.logger.step(`Applying sort: "${option}"`);
    await this.waitForElement(this.sortDropdown);
    await this.sortDropdown.selectOption(option);
  }

  // ── Collection helpers ─────────────────────────────────────────────────────

  /**
   * Returns the visible name of every product currently listed.
   * Use this to assert ordering or filter results.
   */
  public async getAllProductNames(): Promise<string[]> {
    return this.inventoryItems
      .locator('.inventory_item_name')
      .allInnerTexts();
  }

  /**
   * Returns the price of every product as a number (strips '$').
   * Use this to assert all prices satisfy a condition.
   */
  public async getAllPrices(): Promise<number[]> {
    const texts = await this.inventoryItems
      .locator('.inventory_item_price')
      .allInnerTexts();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  /**
   * Asserts that every listed product price is strictly below `maxPrice`.
   * Implements the "assert for all items, not just one" requirement.
   * @param maxPrice - Upper bound (exclusive)
   */
  public async assertAllPricesBelow(maxPrice: number): Promise<void> {
    this.logger.step(`Asserting all prices are below $${maxPrice}`);
    const prices = await this.getAllPrices();
    for (const price of prices) {
      expect(price, `Expected price $${price} to be below $${maxPrice}`).toBeLessThan(maxPrice);
    }
  }

  /**
   * Asserts that prices are sorted in ascending order (lowest → highest).
   * Used to verify "Price (low to high)" sort was applied.
   */
  public async assertPricesSortedAscending(): Promise<void> {
    this.logger.step('Asserting prices are sorted ascending (low to high)');
    const prices = await this.getAllPrices();
    for (let i = 0; i < prices.length - 1; i++) {
      expect(
        prices[i],
        `Expected $${prices[i]} ≤ $${prices[i + 1]} at index ${i}`
      ).toBeLessThanOrEqual(prices[i + 1]);
    }
  }

  /**
   * Asserts that prices are sorted in descending order (highest → lowest).
   * Used to verify "Price (high to low)" sort was applied.
   */
  public async assertPricesSortedDescending(): Promise<void> {
    this.logger.step('Asserting prices are sorted descending (high to low)');
    const prices = await this.getAllPrices();
    for (let i = 0; i < prices.length - 1; i++) {
      expect(
        prices[i],
        `Expected $${prices[i]} ≥ $${prices[i + 1]} at index ${i}`
      ).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  }

  /**
   * Asserts that product names are listed in the expected order.
   * Used to verify name-based sorts.
   * @param expectedNames - Array of names in the expected display order
   */
  public async assertNamesOrderEqual(expectedNames: string[]): Promise<void> {
    this.logger.step('Asserting product name order');
    const actual = await this.getAllProductNames();
    expect(actual).toEqual(expectedNames);
  }
}
