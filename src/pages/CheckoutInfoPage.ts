/**
 * ============================================
 * FILE: src/pages/CheckoutInfoPage.ts
 * PURPOSE: Checkout step 1 (personal info) — saucedemo.com
 *
 * Equivalent to filling in the checkout form before seeing the order total.
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutInfo } from '../fixtures/checkoutTestData';

export class CheckoutInfoPage extends BasePage {
  protected pageUrl = 'https://www.saucedemo.com/checkout-step-one.html';

  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly zipInput: Locator;
  private readonly continueButton: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = this.page.locator('[data-test="firstName"]');
    this.lastNameInput  = this.page.locator('[data-test="lastName"]');
    this.zipInput       = this.page.locator('[data-test="postalCode"]');
    this.continueButton = this.page.locator('[data-test="continue"]');
    this.pageTitle      = this.page.locator('.title');
  }

  /**
   * Waits for the first-name input to be visible.
   */
  protected async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.firstNameInput);
    this.logger.debug('Checkout info page loaded');
  }

  /**
   * Fills in the checkout info form and clicks Continue.
   * @param info - CheckoutInfo containing firstName, lastName, zip
   */
  public async fillAndContinue(info: CheckoutInfo): Promise<void> {
    this.logger.step(`Filling checkout info for ${info.firstName} ${info.lastName}`);
    await this.fillInput(this.firstNameInput, info.firstName, 'first name');
    await this.fillInput(this.lastNameInput,  info.lastName,  'last name');
    await this.fillInput(this.zipInput,       info.zip,       'zip code');
    await this.clickElement(this.continueButton, 'continue button');
  }

  /**
   * Asserts the checkout info page is visible.
   */
  public async assertPageVisible(): Promise<void> {
    this.logger.step('Asserting checkout info page is visible');
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }
}
