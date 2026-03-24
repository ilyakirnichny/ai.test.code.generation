/**
 * ============================================
 * FILE: src/pages/SecureAreaPage.ts
 * PURPOSE: Page Object for the Secure Area (/secure)
 *
 * Represents the page the user lands on after a successful login.
 * Follows the same conventions as LoginPage and CheckboxesPage:
 *  - extends BasePage
 *  - private readonly locators defined in constructor
 *  - explicit return types on all public methods
 *  - logger.step() for every user-visible action
 *  - assertXxx() methods for assertions
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SecureAreaPage extends BasePage {
  protected pageUrl = '/secure';

  // <h2>Secure Area</h2>
  private readonly heading: Locator;
  // Flash message shown after redirect: "You logged into a secure area!"
  private readonly flashAlert: Locator;
  // Logout link — confirms the user is authenticated
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading    = this.page.getByRole('heading', { name: 'Secure Area', exact: true });
    this.flashAlert = this.page.locator('#flash');
    this.logoutLink = this.page.getByRole('link', { name: /logout/i });
  }

  /**
   * Waits for the secure area heading to be visible before proceeding.
   */
  protected async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.heading);
    this.logger.debug('Secure area page loaded');
  }

  /**
   * Returns the text of the flash welcome message.
   * Strips the close-button character (×) that Playwright includes in textContent.
   */
  public async getWelcomeMessage(): Promise<string> {
    this.logger.step('Reading secure area flash message');
    await this.waitForElement(this.flashAlert);
    return (await this.flashAlert.textContent() ?? '').replace(/×/g, '').trim();
  }

  /**
   * Returns true if the logout link is visible — confirms user is authenticated.
   */
  public async isLogoutVisible(): Promise<boolean> {
    return this.logoutLink.isVisible();
  }

  /**
   * Asserts the secure area heading is visible — equivalent to "avatar visible"
   * in the exercise template; confirms the user reached the authenticated area.
   */
  public async assertAuthenticatedHeadingVisible(): Promise<void> {
    this.logger.step('Asserting secure area heading is visible');
    await expect(this.heading).toBeVisible();
  }

  /**
   * Asserts the welcome flash message contains the expected text.
   * @param expectedText - Substring to look for in the alert
   */
  public async assertWelcomeMessageContains(expectedText: string): Promise<void> {
    this.logger.step(`Asserting welcome message contains "${expectedText}"`);
    await expect(this.flashAlert).toBeVisible();
    const text = await this.getWelcomeMessage();
    expect(text).toContain(expectedText);
  }

  /**
   * Asserts the logout link is visible — user is in an authenticated session.
   */
  public async assertLogoutVisible(): Promise<void> {
    this.logger.step('Asserting logout link is visible');
    await expect(this.logoutLink).toBeVisible();
  }
}
