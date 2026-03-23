/**
 * ============================================
 * FILE: tests/e2e/home.spec.ts
 * PURPOSE: End-to-end tests for the home page
 * ============================================
 */

import { test, expect } from '../../src/fixtures/BaseTest';

/**
 * Home page test suite
 * Validates content, navigation links, and page structure
 */
test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  /**
   * Verify page loads with the correct heading
   */
  test('should display the main heading', async ({ homePage, logger }) => {
    logger.step('Checking main heading visibility');

    await expect(homePage.mainHeading).toBeVisible();

    const heading = await homePage.getMainHeading();
    expect(heading).toBe('Welcome to the-internet');

    logger.info('Main heading verified');
  });

  /**
   * Verify the "Available Examples" sub-heading is present
   */
  test('should display the available examples sub-heading', async ({ homePage, logger }) => {
    logger.step('Checking sub-heading');

    const subHeading = await homePage.getSubHeading();
    expect(subHeading).toBe('Available Examples');

    logger.info('Sub-heading verified');
  });

  /**
   * Verify example links are listed on the page
   */
  test('should have multiple example links', async ({ homePage, logger }) => {
    logger.step('Counting example links');

    const count = await homePage.getExampleLinkCount();
    expect(count).toBeGreaterThan(5);

    logger.info(`Found ${count} example links`);
  });

  /**
   * Verify the Form Authentication (login) link exists
   */
  test('should contain a link to Form Authentication', async ({ homePage, logger }) => {
    logger.step('Checking for Form Authentication link');

    const hasLink = await homePage.hasExampleLink('Form Authentication');
    expect(hasLink).toBeTruthy();

    logger.info('Form Authentication link found');
  });

  /**
   * Verify clicking Form Authentication navigates to the login page
   */
  test('should navigate to login page via Form Authentication link', async ({ homePage, page, logger }) => {
    logger.step('Clicking Form Authentication link');

    await homePage.clickExampleLink('Form Authentication');
    await page.waitForURL(/\/login/);

    expect(page.url()).toContain('/login');
    logger.info('Navigated to login page successfully');
  });

  /**
   * Verify the page title is correct
   */
  test('should have the correct page title', async ({ homePage, logger }) => {
    logger.step('Checking page title');

    const title = await homePage.getTitle();
    expect(title).toContain('The Internet');

    logger.info(`Page title: ${title}`);
  });
});
