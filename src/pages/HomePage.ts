/**
 * ============================================
 * FILE: src/pages/HomePage.ts
 * PURPOSE: Home page object for the-internet.herokuapp.com
 * ============================================
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage - page object for the application home page
 * Provides access to the main landing page and navigation links
 */
export class HomePage extends BasePage {
  protected pageUrl = '/';

  public readonly mainHeading: Locator;
  private readonly subHeading: Locator;
  private readonly exampleLinkItems: Locator;

  /**
   * Creates a new HomePage instance
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page);
    this.mainHeading = this.page.getByRole('heading', { name: 'Welcome to the-internet', exact: true });
    this.subHeading = this.page.getByRole('heading', { name: 'Available Examples', exact: true });
    this.exampleLinkItems = this.page.getByRole('list').getByRole('listitem');
  }

  /**
   * Waits for the home page to be fully loaded
   */
  protected async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.mainHeading);
    this.logger.debug('Home page loaded successfully');
  }

  /**
   * Gets the main heading text
   * @returns Main heading text
   */
  public async getMainHeading(): Promise<string> {
    return this.getElementText(this.mainHeading);
  }

  /**
   * Gets the sub-heading text
   * @returns Sub heading text
   */
  public async getSubHeading(): Promise<string> {
    return this.getElementText(this.subHeading);
  }

  /**
   * Checks if the main heading is visible
   * @returns True if visible
   */
  public async isMainHeadingVisible(): Promise<boolean> {
    return this.isElementVisible(this.mainHeading);
  }

  /**
   * Clicks on a named example link
   * @param name - The link text to click
   */
  public async clickExampleLink(name: string): Promise<void> {
    this.logger.step(`Clicking example link: ${name}`);
    await this.page.getByRole('link', { name, exact: true }).click();
  }

  /**
   * Checks if a specific example link is present
   * @param name - Link text to check
   * @returns True if the link exists
   */
  public async hasExampleLink(name: string): Promise<boolean> {
    this.logger.debug(`Checking for example link: ${name}`);
    return this.page.getByRole('link', { name, exact: true }).isVisible();
  }

  /**
   * Gets the count of example links on the page
   * @returns Number of links
   */
  public async getExampleLinkCount(): Promise<number> {
    return this.exampleLinkItems.count();
  }
}
