/**
 * ============================================
 * FILE: src/pages/CheckboxesPage.ts
 * PURPOSE: Checkboxes page — refactored version
 *
 * ASSIGNMENT 1 — Merge Repetitive Methods
 * Changes applied:
 *
 * BEFORE: 4 separate methods — checkFirstCheckbox, checkSecondCheckbox,
 *         uncheckFirstCheckbox, uncheckSecondCheckbox — identical bodies,
 *         only the hardcoded index differed.
 * AFTER:  2 methods — checkCheckbox(index) and uncheckCheckbox(index) —
 *         the index is now a parameter, duplication eliminated.
 *
 * BEFORE: 2 separate query methods — isFirstCheckboxChecked, isSecondCheckboxChecked
 * AFTER:  1 method — isCheckboxChecked(index) — parameterized.
 *
 * BEFORE: 2 separate log methods with magic strings 'checkbox 1', 'checkbox 2'
 * AFTER:  1 method — logCheckboxState(index) — index used in the message.
 *
 * BEFORE: getCheckboxCount() returned hardcoded 2
 * AFTER:  getCheckboxCount() calls .count() on the real locator.
 *
 * BEFORE: waitAndCheckFirst() used waitForTimeout(1000) — lazy unconditional sleep
 * AFTER:  waitAndCheck(index) waits for the element to be visible before acting.
 *
 * BEFORE: no return types declared on any method
 * AFTER:  all public methods have explicit return types.
 * ============================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
  protected pageUrl = '/checkboxes';

  // Extracted to a single shared locator — not re-queried inside every method
  private readonly checkboxes: Locator;

  constructor(page: Page) {
    super(page);
    this.checkboxes = this.page.getByRole('checkbox');
  }

  /**
   * Checks a checkbox by index if it is not already checked.
   * BEFORE: checkFirstCheckbox() / checkSecondCheckbox() — merged into one method
   * @param index - 0-based checkbox index
   */
  public async checkCheckbox(index: number): Promise<void> {
    if (!await this.checkboxes.nth(index).isChecked()) {
      await this.checkboxes.nth(index).check();
    }
  }

  /**
   * Unchecks a checkbox by index if it is currently checked.
   * BEFORE: uncheckFirstCheckbox() / uncheckSecondCheckbox() — merged into one method
   * @param index - 0-based checkbox index
   */
  public async uncheckCheckbox(index: number): Promise<void> {
    if (await this.checkboxes.nth(index).isChecked()) {
      await this.checkboxes.nth(index).uncheck();
    }
  }

  /**
   * Returns whether a checkbox at the given index is checked.
   * BEFORE: isFirstCheckboxChecked() / isSecondCheckboxChecked() — merged into one method
   * @param index - 0-based checkbox index
   */
  public async isCheckboxChecked(index: number): Promise<boolean> {
    return this.checkboxes.nth(index).isChecked();
  }

  /**
   * Returns the actual number of checkboxes on the page.
   * BEFORE: returned hardcoded 2
   * AFTER:  uses .count() on the real locator
   */
  public async getCheckboxCount(): Promise<number> {
    return this.checkboxes.count();
  }

  /**
   * Waits for a checkbox to be visible, then checks it.
   * BEFORE: waitForTimeout(1000) — unconditional sleep
   * AFTER:  waitForElement — waits only as long as needed
   * @param index - 0-based checkbox index
   */
  public async waitAndCheck(index: number): Promise<void> {
    await this.waitForElement(this.checkboxes.nth(index));
    await this.checkCheckbox(index);
  }

  /**
   * Logs the state of a checkbox to the console.
   * BEFORE: logFirstCheckboxState() / logSecondCheckboxState() with magic strings
   * AFTER:  single method, index used in the message
   * @param index - 0-based checkbox index
   */
  public async logCheckboxState(index: number): Promise<void> {
    const isChecked = await this.isCheckboxChecked(index);
    this.logger.info(`checkbox ${index} state: ${isChecked}`);
  }

  /**
   * Asserts that a checkbox at the given index is checked.
   * Extracted from repeated inline assertion: expect(page.getByRole('checkbox').nth(i)).toBeChecked()
   * @param index - 0-based checkbox index
   */
  public async assertChecked(index: number): Promise<void> {
    await expect(this.checkboxes.nth(index)).toBeChecked();
  }

  /**
   * Asserts that a checkbox at the given index is not checked.
   * Extracted from repeated inline assertion: expect(...).not.toBeChecked()
   * @param index - 0-based checkbox index
   */
  public async assertUnchecked(index: number): Promise<void> {
    await expect(this.checkboxes.nth(index)).not.toBeChecked();
  }
}
