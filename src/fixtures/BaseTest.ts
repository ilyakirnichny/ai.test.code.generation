/**
 * ============================================
 * FILE: src/fixtures/BaseTest.ts
 * PURPOSE: Base test class with setup and teardown hooks
 * ============================================
 */

import { test as base } from '@playwright/test';
import { Logger } from '../utils/logger';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CheckboxesPage } from '../pages/CheckboxesPage';
import { DropdownPage } from '../pages/DropdownPage';
import { SecureAreaPage } from '../pages/SecureAreaPage';

/**
 * Extended test fixture with custom setup and teardown
 * Provides common test utilities and lifecycle hooks
 */
export type BaseTestFixtures = {
  logger: Logger;
  loginPage: LoginPage;
  homePage: HomePage;
  checkboxesPage: CheckboxesPage;
  dropdownPage: DropdownPage;
  secureAreaPage: SecureAreaPage;
};

/**
 * BaseTest - custom test with fixtures and hooks
 * Use this instead of the default Playwright test
 */
export const test = base.extend<BaseTestFixtures>({
  /**
   * Logger fixture - provides a logger instance for each test
   */
  logger: async ({ }, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    logger.info(`Starting test: ${testInfo.title}`);
    logger.info(`Project: ${testInfo.project.name}`);
    
    await use(logger);
    
    logger.info(`Test finished: ${testInfo.title}`);
    logger.info(`Status: ${testInfo.status}`);
    logger.info(`Duration: ${testInfo.duration}ms`);
  },

  /**
   * Page fixture override - adds logging for page lifecycle
   */
  page: async ({ page }, use, testInfo) => {
    const logger = new Logger('PageFixture');
    logger.debug(`Page created for test: ${testInfo.title}`);
    await use(page);
    logger.debug('Page cleanup completed');
  },

  /**
   * LoginPage fixture - creates a LoginPage instance for each test
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /**
   * HomePage fixture - creates a HomePage instance for each test
   */
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  /**
   * CheckboxesPage fixture - creates a CheckboxesPage instance for each test
   */
  checkboxesPage: async ({ page }, use) => {
    await use(new CheckboxesPage(page));
  },

  /**
   * DropdownPage fixture - creates a DropdownPage instance for each test
   */
  dropdownPage: async ({ page }, use) => {
    await use(new DropdownPage(page));
  },

  /**
   * SecureAreaPage fixture - creates a SecureAreaPage instance for each test
   */
  secureAreaPage: async ({ page }, use) => {
    await use(new SecureAreaPage(page));
  },
});

export { expect } from '@playwright/test';
