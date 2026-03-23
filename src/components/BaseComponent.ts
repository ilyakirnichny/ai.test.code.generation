/**
 * ============================================
 * FILE: src/components/BaseComponent.ts
 * PURPOSE: Base component class for reusable UI components
 * ============================================
 */

import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * BaseComponent class - foundation for all component objects
 * Represents reusable UI components shared across multiple pages
 */
export abstract class BaseComponent {
  protected page: Page;
  protected logger: Logger;
  protected rootLocator?: Locator;

  /**
   * Creates a new BaseComponent instance
   * @param page - Playwright Page object
   * @param rootLocator - Optional root locator scoping all interactions to this component
   */
  constructor(page: Page, rootLocator?: Locator) {
    this.page = page;
    this.rootLocator = rootLocator;
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Waits for the component root to become visible
   * @param timeoutMs - Optional timeout in milliseconds
   */
  public async waitForVisible(timeoutMs?: number): Promise<void> {
    if (this.rootLocator) {
      await this.rootLocator.waitFor({ state: 'visible', timeout: timeoutMs });
      this.logger.debug('Component is visible');
    }
  }

  /**
   * Checks if the component root is visible
   * @returns True if visible, false otherwise
   */
  public async isVisible(): Promise<boolean> {
    return this.rootLocator ? this.rootLocator.isVisible() : true;
  }

  /**
   * Clicks an element within the component
   * @param locator - Element locator
   * @param description - Description for logging
   */
  protected async clickElement(locator: Locator, description: string): Promise<void> {
    this.logger.step(`Clicking on ${description}`);
    await locator.click();
  }

  /**
   * Gets text content from an element
   * @param locator - Element locator
   * @returns Trimmed text content
   */
  protected async getElementText(locator: Locator): Promise<string> {
    return (await locator.textContent() || '').trim();
  }
}
