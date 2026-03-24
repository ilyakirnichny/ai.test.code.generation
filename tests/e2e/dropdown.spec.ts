/**
 * ============================================
 * FILE: tests/e2e/dropdown.spec.ts
 * PURPOSE: Tests for the Dropdown page
 *          https://the-internet.herokuapp.com/dropdown
 *
 * Follows the same conventions as checkboxes.spec.ts / login.spec.ts:
 *  - BaseTest fixture provides the page object (no manual instantiation)
 *  - beforeEach navigates once before every test
 *  - Sections marked // Initialization / // User actions / // Verification
 * ============================================
 */

import { test, expect } from '../../src/fixtures/BaseTest';

test.describe('Dropdown Tests', () => {

  // Initialization — navigate to the page before each test
  test.beforeEach(async ({ dropdownPage }) => {
    await dropdownPage.navigate();
  });

  test('should display the dropdown on the page', async ({ dropdownPage }) => {
    // Initialization — page navigated in beforeEach

    // Verification
    await dropdownPage.assertDropdownVisible();
  });

  test('should select Option 1 from the dropdown', async ({ dropdownPage }) => {
    // Initialization — page navigated in beforeEach

    // User actions
    await dropdownPage.selectOption('Option 1');

    // Verification
    await dropdownPage.assertSelectedValue('1');
  });

  test('should select Option 2 from the dropdown', async ({ dropdownPage }) => {
    // Initialization — page navigated in beforeEach

    // User actions
    await dropdownPage.selectOption('Option 2');

    // Verification
    await dropdownPage.assertSelectedValue('2');
  });

  test('should change selection from Option 1 to Option 2', async ({ dropdownPage }) => {
    // Initialization — page navigated in beforeEach

    // User actions — select first, then change
    await dropdownPage.selectOption('Option 1');
    await dropdownPage.selectOption('Option 2');

    // Verification — only the last selection should be active
    await dropdownPage.assertSelectedValue('2');
  });

  test('should list the correct available options', async ({ dropdownPage }) => {
    // Initialization — page navigated in beforeEach

    // User actions — retrieve all non-disabled options
    const options = await dropdownPage.getAvailableOptions();

    // Verification
    expect(options).toEqual(['Option 1', 'Option 2']);
  });
});
