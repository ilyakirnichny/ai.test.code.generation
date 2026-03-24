/**
 * ============================================
 * FILE: src/components/CartBadge.ts
 * PURPOSE: Header cart badge component — Swag Labs / saucedemo.com
 *
 * Represents the shopping cart icon in the top-right header.
 * Extends BaseComponent following the same conventions as all other components.
 *  - rootLocator scopes all queries to the cart link container
 *  - assertBadgeCount() for badge assertions (no inline expect in tests)
 *  - clickCart() to navigate to the cart page
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class CartBadge extends BaseComponent {
  // Badge element showing the number of items: <span class="shopping_cart_badge">
  private readonly badge: Locator;

  constructor(page: Page) {
    // Root: the cart link icon in the header
    super(page, page.locator('.shopping_cart_link'));
    this.badge = this.page.locator('.shopping_cart_badge');
  }

  /**
   * Returns the current badge count as a number.
   * Returns 0 if the badge is not visible (empty cart).
   */
  public async getBadgeCount(): Promise<number> {
    if (!await this.badge.isVisible()) return 0;
    const text = await this.badge.textContent();
    return parseInt(text?.trim() ?? '0', 10);
  }

  /**
   * Asserts the badge displays the expected item count.
   * @param expected - Expected number of items shown in the badge
   */
  public async assertBadgeCount(expected: number): Promise<void> {
    this.logger.step(`Asserting cart badge count is ${expected}`);
    if (expected === 0) {
      await expect(this.badge).not.toBeVisible();
    } else {
      await expect(this.badge).toBeVisible();
      await expect(this.badge).toHaveText(String(expected));
    }
  }

  /**
   * Clicks the cart icon to navigate to the cart page.
   */
  public async clickCart(): Promise<void> {
    this.logger.step('Clicking cart icon to open cart page');
    await this.rootLocator!.click();
  }
}
