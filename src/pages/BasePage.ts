/**
 * ============================================
 * FILE: src/pages/BasePage.ts
 * PURPOSE: Base page class with common page methods
 * ============================================
 */

import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * BasePage class - foundation for all page objects
 * Provides common functionality for page interactions
 */
export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected abstract pageUrl: string;

  /**
   * Creates a new BasePage instance
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Navigates to the page URL
   */
  public async navigate(): Promise<void> {
    this.logger.step(`Navigating to ${this.pageUrl}`);
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  /**
   * Waits for the page to be fully loaded
   * Override in child classes for specific page load conditions
   */
  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    this.logger.debug('Page loaded');
  }

  /**
   * Gets the current page URL
   * @returns Current URL string
   */
  public async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Gets the page title
   * @returns Page title string
   */
  public async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Waits for an element to be visible
   * @param locator - Element locator
   * @param timeoutMs - Optional timeout in milliseconds
   */
  protected async waitForElement(locator: Locator, timeoutMs?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  /**
   * Clicks on an element using locator
   * @param locator - Element locator
   * @param description - Description for logging
   */
  protected async clickElement(locator: Locator, description: string): Promise<void> {
    this.logger.step(`Clicking on ${description}`);
    await locator.click();
  }

  /**
   * Fills a text input field
   * @param locator - Element locator
   * @param text - Text to fill
   * @param description - Description for logging
   */
  protected async fillInput(locator: Locator, text: string, description: string): Promise<void> {
    this.logger.step(`Filling ${description} with value`);
    await locator.fill(text);
  }

  /**
   * Gets text content from an element
   * @param locator - Element locator
   * @returns Text content
   */
  protected async getElementText(locator: Locator): Promise<string> {
    return ((await locator.textContent()) || '').trim();
  }

  /**
   * Checks if an element is visible
   * @param locator - Element locator
   * @returns True if visible, false otherwise
   */
  protected async isElementVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  /**
   * Takes a screenshot of the page
   * @param name - Screenshot filename
   */
  public async takeScreenshot(name: string): Promise<void> {
    this.logger.info(`Taking screenshot: ${name}`);
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Reloads the current page
   */
  public async reload(): Promise<void> {
    this.logger.step('Reloading page');
    await this.page.reload();
  }

  /**
   * Waits for a specific amount of time
   * @param milliseconds - Time to wait in milliseconds
   */
  private async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }
}
