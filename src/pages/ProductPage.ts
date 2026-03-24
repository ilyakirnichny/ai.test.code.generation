/**
 * ============================================
 * FILE: src/pages/ProductPage.ts
 * PURPOSE: Product detail page — saucedemo.com (/inventory-item.html)
 *
 * EXERCISE 4 — AFTER STATE (locators fixed)
 *
 * Fixed locators:
 * 1. addToCartButton: `.btn_primary` → `[data-test^="add-to-cart"]`
 * 2. productPrice: XPath `//div[@class=...]` → `[data-test="inventory-item-price"]`
 *
 * All class/method signatures remain unchanged.
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  protected pageUrl = 'https://www.saucedemo.com/inventory-item.html';

  private readonly productName: Locator;
  private readonly productDescription: Locator;
  // ✅ FIXED — stable data-test prefix selector (matches any product's add-to-cart button)
  private readonly addToCartButton: Locator;
  // ✅ FIXED — stable data-test attribute (replaces fragile XPath)
  private readonly productPrice: Locator;
  private readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName        = this.page.locator('[data-test="inventory-item-name"]');
    this.productDescription = this.page.locator('[data-test="inventory-item-desc"]');
    // ✅ FIXED: was `.btn_primary` — now uses data-test prefix, works for any product
    this.addToCartButton    = this.page.locator('[data-test^="add-to-cart"]');
    // ✅ FIXED: was XPath `//div[@class="inventory_details_price"]` — now uses data-test
    this.productPrice       = this.page.locator('[data-test="inventory-item-price"]');
    this.backButton         = this.page.locator('[data-test="back-to-products"]');
  }

  protected async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.productName);
    this.logger.debug('Product detail page loaded');
  }

  public async getProductName(): Promise<string> {
    return (await this.productName.textContent() ?? '').trim();
  }

  public async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent() ?? '').trim();
  }

  public async addToCart(): Promise<void> {
    this.logger.step('Clicking Add to cart on product detail page');
    await this.clickElement(this.addToCartButton, 'add to cart button');
  }

  public async goBack(): Promise<void> {
    this.logger.step('Navigating back to products');
    await this.clickElement(this.backButton, 'back to products button');
  }

  public async assertNameVisible(): Promise<void> {
    this.logger.step('Asserting product name is visible');
    await expect(this.productName).toBeVisible();
  }

  public async assertPriceVisible(): Promise<void> {
    this.logger.step('Asserting product price is visible');
    await expect(this.productPrice).toBeVisible();
  }
}
