/**
 * ============================================
 * FILE: tests/exercises/ex1-auth-flow/auth.spec.ts
 * PURPOSE: Exercise 1 — Auth Flow (Positive + Negative)
 *
 * Tests both successful and failed login attempts.
 * Reuses existing LoginPage and SecureAreaPage page objects.
 * Credentials come from authTestData — never hardcoded in the spec.
 *
 * Conventions followed:
 *  - BaseTest fixture provides page objects (no manual instantiation)
 *  - beforeEach navigates to the login page
 *  - Sections annotated: // Initialization / // User actions / // Verification
 *  - Assertions use Page Object methods — no inline expect on raw locators
 * ============================================
 */

import { test, expect } from '../../../src/fixtures/BaseTest';
import {
  validUser,
  invalidPasswordUser,
  unknownUser,
} from '../../../src/fixtures/authTestData';

test.describe('Auth Flow', () => {

  // Initialization — navigate to the login page before every test
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  // ── Positive tests ──────────────────────────────────────────────────────────

  test('should log in with valid credentials and reach the secure area', async ({
    loginPage,
    secureAreaPage,
  }) => {
    // Initialization — login page loaded in beforeEach

    // User actions
    await loginPage.loginAndGoToSecureArea(validUser.username, validUser.password);

    // Verification — authenticated heading (equivalent to "avatar visible")
    await secureAreaPage.assertAuthenticatedHeadingVisible();
    await secureAreaPage.assertLogoutVisible();
    await secureAreaPage.assertWelcomeMessageContains('You logged into a secure area!');
  });

  test('should show the logout link after a successful login', async ({
    loginPage,
    secureAreaPage,
  }) => {
    // Initialization — login page loaded in beforeEach

    // User actions
    await loginPage.loginAndGoToSecureArea(validUser.username, validUser.password);

    // Verification
    await secureAreaPage.assertLogoutVisible();
  });

  // ── Negative tests ──────────────────────────────────────────────────────────

  test('should show an error for an invalid password', async ({ loginPage }) => {
    // Initialization — login page loaded in beforeEach

    // User actions
    await loginPage.login(invalidPasswordUser.username, invalidPasswordUser.password);

    // Verification — error alert visible, no redirect
    await loginPage.assertAlertContains('Your password is invalid!');
    expect(await loginPage.getCurrentUrl()).toContain('/login');
  });

  test('should show an error for an unknown username', async ({ loginPage }) => {
    // Initialization — login page loaded in beforeEach

    // User actions
    await loginPage.login(unknownUser.username, unknownUser.password);

    // Verification
    await loginPage.assertAlertContains('Your username is invalid!');
    expect(await loginPage.getCurrentUrl()).toContain('/login');
  });

  test('should remain on the login page with empty credentials', async ({ loginPage }) => {
    // Initialization — login page loaded in beforeEach

    // User actions — submit without filling any fields
    await loginPage.clickLoginButton();

    // Verification
    await loginPage.assertAlertContains('Your username is invalid!');
    expect(await loginPage.getCurrentUrl()).toContain('/login');
  });
});
