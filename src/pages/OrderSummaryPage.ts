/**
 * ============================================
 * FILE: src/pages/OrderSummaryPage.ts
 * PURPOSE: Checkout step 2 (order overview / total) — saucedemo.com
 *          Equivalent to CheckoutPage.total() + placeOrder() from the exercise.
 *
 * Provides: getItemTotal(), getTax(), getTotal(), finish(),
 *           assertTotalMatches(), assertOrderComplete()
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderSummaryPage extends BasePage {
  protected pageUrl = 'https://www.saucedemo.com/checkout-step-two.html';

  private readonly itemTotalLabel: Locator;   // "Item total: $X.XX"
  private readonly taxLabel: Locator;          // "Tax: $X.XX"
  private readonly totalLabel: Locator;        // "Total: $X.XX"
  private readonly finishButton: Locator;
  private readonly confirmationHeader: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.itemTotalLabel      = this.page.locator('.summary_subtotal_label');
    this.taxLabel            = this.page.locator('.summary_tax_label');
    this.totalLabel          = this.page.locator('.summary_total_label');
    this.finishButton        = this.page.locator('[data-test="finish"]');
    this.confirmationHeader  = this.page.locator('.complete-header');
    this.pageTitle           = this.page.locator('.title');
  }

  /**
   * Waits for the total label to be visible.
   */
  protected async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.totalLabel);
    this.logger.debug('Order summary page loaded');
  }

  /**
   * Returns the item subtotal text, e.g. 'Item total: $29.99'.
   */
  public async getItemTotal(): Promise<string> {
    return (await this.itemTotalLabel.textContent() ?? '').trim();
  }

  /**
   * Returns the tax text, e.g. 'Tax: $2.40'.
   */
  public async getTax(): Promise<string> {
    return (await this.taxLabel.textContent() ?? '').trim();
  }

  /**
   * Returns the grand total text, e.g. 'Total: $32.39'.
   */
  public async getTotal(): Promise<string> {
    return (await this.totalLabel.textContent() ?? '').trim();
  }

  /**
   * Clicks the Finish button to place the order.
   */
  public async finish(): Promise<void> {
    this.logger.step('Clicking Finish to place order');
    await this.clickElement(this.finishButton, 'finish button');
    await this.waitForElement(this.confirmationHeader);
  }

  /**
   * Asserts the item total label contains the expected price string.
   * @param expectedPrice - e.g. '$29.99'
   */
  public async assertItemTotalContains(expectedPrice: string): Promise<void> {
    this.logger.step(`Asserting item total contains "${expectedPrice}"`);
    await expect(this.itemTotalLabel).toContainText(expectedPrice);
  }

  /**
   * Asserts the grand total label contains the expected value.
   * @param expectedTotal - e.g. '$32.39'
   */
  public async assertTotalContains(expectedTotal: string): Promise<void> {
    this.logger.step(`Asserting order total contains "${expectedTotal}"`);
    await expect(this.totalLabel).toContainText(expectedTotal);
  }

  /**
   * Asserts the order summary page title is visible.
   */
  public async assertPageVisible(): Promise<void> {
    this.logger.step('Asserting order overview page is visible');
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  /**
   * Asserts the order confirmation is shown after finish().
   */
  public async assertOrderComplete(): Promise<void> {
    this.logger.step('Asserting order completion confirmation');
    await expect(this.confirmationHeader).toBeVisible();
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
  }
}
