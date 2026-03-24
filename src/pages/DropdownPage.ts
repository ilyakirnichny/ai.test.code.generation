/**
 * ============================================
 * FILE: src/pages/DropdownPage.ts
 * PURPOSE: Page Object for the Dropdown page
 *          https://the-internet.herokuapp.com/dropdown
 *
 * Follows the same conventions as CheckboxesPage / LoginPage:
 *  - protected pageUrl for navigation
 *  - private readonly locators defined in constructor
 *  - public async methods with explicit return types
 *  - this.logger.step() for every user-visible action
 *  - waitForElement() before interacting with elements
 *  - assertXxx() methods for assertions
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DropdownPage extends BasePage {
  protected pageUrl = '/dropdown';

  // Stable selector: <select id="dropdown"> — uses the id attribute
  private readonly dropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.dropdown = this.page.locator('#dropdown');
  }

  /**
   * Selects an option from the dropdown by its visible text label.
   * @param label - Visible text of the option, e.g. 'Option 1'
   */
  public async selectOption(label: string): Promise<void> {
    this.logger.step(`Selecting dropdown option: "${label}"`);
    await this.waitForElement(this.dropdown);
    await this.dropdown.selectOption({ label });
  }

  /**
   * Returns the currently selected option's visible text.
   */
  public async getSelectedOption(): Promise<string> {
    await this.waitForElement(this.dropdown);
    return this.dropdown.inputValue();
  }

  /**
   * Returns all available option labels (excluding the disabled placeholder).
   */
  public async getAvailableOptions(): Promise<string[]> {
    await this.waitForElement(this.dropdown);
    return this.dropdown.locator('option:not([disabled])').allInnerTexts();
  }

  /**
   * Asserts that the dropdown currently shows the given value.
   * Uses the option's value attribute (e.g. '1', '2').
   * @param value - Option value attribute to assert
   */
  public async assertSelectedValue(value: string): Promise<void> {
    this.logger.step(`Asserting dropdown selected value is "${value}"`);
    await expect(this.dropdown).toHaveValue(value);
  }

  /**
   * Asserts that the dropdown is visible and enabled on the page.
   */
  public async assertDropdownVisible(): Promise<void> {
    this.logger.step('Asserting dropdown is visible');
    await expect(this.dropdown).toBeVisible();
    await expect(this.dropdown).toBeEnabled();
  }
}
