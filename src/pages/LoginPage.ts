/**
 * ============================================
 * FILE: src/pages/LoginPage.ts
 * PURPOSE: Login page object with authentication methods
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - page object for login functionality
 * Handles user authentication interactions
 */
export class LoginPage extends BasePage {
  protected pageUrl = '/login';

  public readonly usernameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;
  private readonly pageHeading: Locator;
  private readonly flashAlert: Locator;
  private readonly logoutLink: Locator;

  /**
   * Creates a new LoginPage instance
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByLabel(/username/i);
    this.passwordInput = this.page.getByLabel(/password/i);
    this.loginButton = this.page.getByRole('button', { name: /login/i });
    this.pageHeading = this.page.getByRole('heading', { name: /login/i });
    this.flashAlert = this.page.locator('#flash');
    this.logoutLink = this.page.getByRole('link', { name: /logout/i });
  }

  /**
   * Waits for the login page to be fully loaded
   */
  protected async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.pageHeading);
    this.logger.debug('Login page loaded successfully');
  }

  /**
   * Enters username into the username field
   * @param username - Username to enter
   */
  public async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username, 'username field');
  }

  /**
   * Enters password into the password field
   * @param password - Password to enter
   */
  public async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password, 'password field');
  }

  /**
   * Clicks the login button
   */
  public async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton, 'login button');
  }

  /**
   * Performs complete login flow
   * @param username - Username for login
   * @param password - Password for login
   */
  public async login(username: string, password: string): Promise<void> {
    this.logger.step(`Logging in with username: ${username}`);
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Gets the flash alert message text
   * @returns Alert message text
   */
  public async getAlertMessage(): Promise<string> {
    this.logger.step('Reading flash alert message');
    await this.waitForElement(this.flashAlert);
    return (await this.flashAlert.textContent() || '').replace(/×/g, '').trim();
  }

  /**
   * Checks if the flash alert is displayed
   * @returns True if alert is visible
   */
  public async isAlertDisplayed(): Promise<boolean> {
    return this.flashAlert.isVisible();
  }

  /**
   * Checks if username field is visible
   * @returns True if visible
   */
  public async isUsernameFieldVisible(): Promise<boolean> {
    return this.isElementVisible(this.usernameInput);
  }

  /**
   * Checks if password field is visible
   * @returns True if visible
   */
  public async isPasswordFieldVisible(): Promise<boolean> {
    return this.isElementVisible(this.passwordInput);
  }

  /**
   * Checks if login button is visible
   * @returns True if visible
   */
  public async isLoginButtonVisible(): Promise<boolean> {
    return this.isElementVisible(this.loginButton);
  }

  /**
   * Gets the page heading text
   * @returns Heading text
   */
  public async getPageHeading(): Promise<string> {
    return this.getElementText(this.pageHeading);
  }

  /**
   * Performs login and waits for redirect to the secure area.
   * Extracted from repeated sequence: login() + page.waitForURL(/\/secure/)
   * @param username - Username for login
   * @param password - Password for login
   */
  public async loginAndGoToSecureArea(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.page.waitForURL(/\/secure/);
    this.logger.step('Redirected to secure area');
  }

  /**
   * Clicks the logout link and waits for redirect back to the login page.
   */
  public async logout(): Promise<void> {
    this.logger.step('Clicking logout link');
    await this.logoutLink.click();
    await this.page.waitForURL(/\/login/);
  }

  /**
   * Asserts the flash alert is visible and its message contains the expected text.
   * Extracted from repeated sequence: isAlertDisplayed() + getAlertMessage() + toContain()
   * @param expectedText - Text the alert should contain
   * @returns The full alert message
   */
  public async assertAlertContains(expectedText: string): Promise<void> {
    await expect(this.flashAlert).toBeVisible();
    const message = await this.getAlertMessage();
    expect(message).toContain(expectedText);
  }
}
