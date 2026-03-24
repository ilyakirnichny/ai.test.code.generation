/**
 * ============================================
 * FILE: src/pages/SauceLoginPage.ts
 * PURPOSE: Login Page Object for saucedemo.com (Exercise 2)
 *
 * Separate from the existing LoginPage (the-internet.herokuapp.com).
 * Uses absolute pageUrl so BasePage.navigate() works across origins.
 * Follows the same conventions as LoginPage:
 *  - extends BasePage
 *  - private readonly locators in constructor
 *  - login(user, pass) composite method
 *  - explicit return types, JSDoc on all public methods
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SauceLoginPage extends BasePage {
  // Absolute URL — saucedemo is a separate origin from the-internet.herokuapp.com
  protected pageUrl = 'https://www.saucedemo.com/';

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.locator('[data-test="username"]');
    this.passwordInput = this.page.locator('[data-test="password"]');
    this.loginButton   = this.page.locator('[data-test="login-button"]');
    this.errorMessage  = this.page.locator('[data-test="error"]');
  }

  /**
   * Waits for the login button to be visible before interacting.
   */
  protected async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.loginButton);
    this.logger.debug('Sauce login page loaded');
  }

  /**
   * Performs the complete login flow.
   * @param username - Sauce Labs username
   * @param password - Sauce Labs password
   */
  public async login(username: string, password: string): Promise<void> {
    this.logger.step(`Logging in as: ${username}`);
    await this.fillInput(this.usernameInput, username, 'username field');
    await this.fillInput(this.passwordInput, password, 'password field');
    await this.clickElement(this.loginButton, 'login button');
  }

  /**
   * Returns the error message text shown on failed login.
   */
  public async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return (await this.errorMessage.textContent() ?? '').trim();
  }

  /**
   * Asserts the error message contains the expected text.
   * @param text - Substring expected in the error
   */
  public async assertErrorContains(text: string): Promise<void> {
    this.logger.step(`Asserting login error contains "${text}"`);
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(text);
  }
}
