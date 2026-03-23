/**
 * ============================================
 * FILE: tests/e2e/login.spec.ts
 * PURPOSE: End-to-end tests for login functionality
 * ============================================
 */

import { test, expect } from '../../src/fixtures/BaseTest';
import { EnvHelper } from '../../src/utils/envHelper';

/**
 * Login test suite
 * Tests authentication flows including success and failure scenarios
 */
test.describe('Login Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  /**
   * Test successful login with valid credentials
   */
  test('should login successfully with valid credentials', async ({ loginPage, logger }) => {
    logger.step('Starting successful login test');
    const credentials = EnvHelper.getCredentials();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // login() + waitForURL(/\/secure/) extracted to loginAndGoToSecureArea()
    await loginPage.loginAndGoToSecureArea(credentials.username, credentials.password);

    // Verify success flash message
    // isAlertDisplayed() + getAlertMessage() + toContain() extracted to assertAlertContains()
    await loginPage.assertAlertContains('You logged into a secure area!');

    logger.info('Login test completed successfully');
  });

  /**
   * Test login failure with invalid username
   */
  test('should show error message with invalid username', async ({ loginPage, logger }) => {
    logger.step('Starting invalid username test');

    await loginPage.login('invalidUser', 'SuperSecretPassword!');

    // isAlertDisplayed() + getAlertMessage() + toContain() extracted to assertAlertContains()
    await loginPage.assertAlertContains('Your username is invalid!');
    expect(await loginPage.getCurrentUrl()).toContain('/login');

    logger.info('Invalid username test completed');
  });

  /**
   * Test login failure with invalid password
   */
  test('should show error message with invalid password', async ({ loginPage, logger }) => {
    logger.step('Starting invalid password test');

    await loginPage.login('tomsmith', 'wrongPassword');

    // isAlertDisplayed() + getAlertMessage() + toContain() extracted to assertAlertContains()
    await loginPage.assertAlertContains('Your password is invalid!');
    expect(await loginPage.getCurrentUrl()).toContain('/login');

    logger.info('Invalid password test completed');
  });

  /**
   * Test login with empty credentials
   */
  test('should remain on login page with empty credentials', async ({ loginPage, logger }) => {
    logger.step('Starting empty credentials test');

    await loginPage.clickLoginButton();
    expect(await loginPage.getCurrentUrl()).toContain('/login');
    await loginPage.assertAlertContains('Your username is invalid!');

    logger.info('Empty credentials test completed');
  });

  /**
   * Test logout functionality
   */
  test('should logout successfully after login', async ({ loginPage, logger }) => {
    logger.step('Starting logout test');
    const credentials = EnvHelper.getCredentials();

    // login() + waitForURL(/\/secure/) extracted to loginAndGoToSecureArea()
    await loginPage.loginAndGoToSecureArea(credentials.username, credentials.password);

    // Click logout link + waitForURL(/\/login/) extracted to logout()
    await loginPage.logout();

    await expect(loginPage.usernameInput).toBeVisible();
    expect(await loginPage.getCurrentUrl()).toContain('/login');

    // isAlertDisplayed() + getAlertMessage() + toContain() extracted to assertAlertContains()
    await loginPage.assertAlertContains('You logged out of the secure area!');

    logger.info('Logout test completed successfully');
  });
});
