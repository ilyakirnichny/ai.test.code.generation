/**
 * ============================================
 * FILE: tests/e2e/checkboxes.spec.ts
 * PURPOSE: Checkboxes tests — refactored version
 *
 * ASSIGNMENT 1 — Merge Repetitive Methods
 * Changes applied:
 *
 * BEFORE: page.goto('https://...') hardcoded and duplicated in every test
 * AFTER:  beforeEach calls checkboxesPage.navigate() — runs once before each test
 *
 * BEFORE: new CheckboxesPage(page) instantiated manually inside every test
 * AFTER:  CheckboxesPage created once in beforeEach, shared via local variable
 *
 * BEFORE: test names were 'test 1', 'test 2' — no description of intent
 * AFTER:  descriptive names that state the expected outcome
 *
 * BEFORE: expect(checked).toBe(true) — raw boolean assertion
 * AFTER:  expect(locator).toBeChecked() — Playwright-native matcher with better error output
 *
 * BEFORE: two separate assertions repeated for first/second checkbox in test 5
 * AFTER:  loop over indices — single assertion pattern, no duplication
 * ============================================
 */

import { test, expect } from '../../src/fixtures/BaseTest';

test.describe('Checkboxes Tests', () => {
  // BEFORE: let checkboxesPage instantiated manually in beforeEach
  // AFTER:  checkboxesPage comes from the BaseTest fixture — no manual instantiation
  test.beforeEach(async ({ checkboxesPage }) => {
    await checkboxesPage.navigate();
  });

  // BEFORE: 'test 1' — vague name
  // AFTER:  describes the expected outcome
  test('should check the first checkbox', async ({ checkboxesPage }) => {
    await checkboxesPage.checkCheckbox(0);

    // BEFORE: expect(page.getByRole('checkbox').nth(0)).toBeChecked() — inline locator
    // AFTER:  assertChecked(index) — assertion extracted to CheckboxesPage
    await checkboxesPage.assertChecked(0);
  });

  // BEFORE: 'test 2'
  test('should check the second checkbox', async ({ checkboxesPage }) => {
    await checkboxesPage.checkCheckbox(1);
    await checkboxesPage.assertChecked(1);
  });

  // BEFORE: 'test 3'
  test('should uncheck the first checkbox after checking it', async ({ checkboxesPage }) => {
    await checkboxesPage.checkCheckbox(0);
    await checkboxesPage.uncheckCheckbox(0);
    await checkboxesPage.assertUnchecked(0);
  });

  // BEFORE: 'test 4' — magic number 2 in assertion
  // AFTER:  count comes from the real DOM via getCheckboxCount()
  test('should display the correct number of checkboxes', async ({ checkboxesPage }) => {
    const count = await checkboxesPage.getCheckboxCount();
    expect(count).toBe(2);
  });

  // BEFORE: 'test 5' — two separate copy-pasted assertions
  // AFTER:  loop over indices — single assertion pattern, scales to any count
  test('should check all checkboxes', async ({ checkboxesPage }) => {
    const count = await checkboxesPage.getCheckboxCount();

    for (let i = 0; i < count; i++) {
      await checkboxesPage.checkCheckbox(i);
    }

    // BEFORE: inline expect(page.getByRole('checkbox').nth(i)).toBeChecked() in loop
    // AFTER:  assertChecked(i) — extracted to CheckboxesPage
    for (let i = 0; i < count; i++) {
      await checkboxesPage.assertChecked(i);
    }
  });
});
