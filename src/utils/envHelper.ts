/**
 * ============================================
 * FILE: src/utils/envHelper.ts
 * PURPOSE: Environment variable helper and configuration manager
 * ============================================
 */

/**
 * Environment configuration helper
 * Centralizes access to environment variables with defaults
 */
export class EnvHelper {
  /**
   * Gets the base URL for the application under test
   * @returns Base URL string
   */
  public static getBaseUrl(): string {
    return process.env.BASE_URL || 'https://the-internet.herokuapp.com';
  }

  /**
   * Gets the test environment (e.g., dev, staging, prod)
   * @returns Environment name
   */
  public static getEnvironment(): string {
    return process.env.TEST_ENV || 'staging';
  }

  /**
   * Gets the browser name for test execution
   * @returns Browser name
   */
  public static getBrowser(): string {
    return process.env.BROWSER || 'chromium';
  }

  /**
   * Checks if running in headless mode
   * @returns True if headless mode is enabled
   */
  public static isHeadless(): boolean {
    return process.env.HEADLESS !== 'false';
  }

  /**
   * Gets the timeout value in milliseconds
   * @returns Timeout value
   */
  public static getTimeout(): number {
    return parseInt(process.env.TIMEOUT || '30000', 10);
  }

  /**
   * Gets test credentials from environment
   * @returns Object containing username and password
   */
  public static getCredentials(): { username: string; password: string } {
    return {
      username: process.env.TEST_USERNAME || 'tomsmith',
      password: process.env.TEST_PASSWORD || 'SuperSecretPassword!',
    };
  }

  /**
   * Checks if debug mode is enabled
   * @returns True if debug mode is enabled
   */
  public static isDebugMode(): boolean {
    return process.env.DEBUG === 'true';
  }

  /**
   * Gets the number of retry attempts
   * @returns Number of retries
   */
  public static getRetries(): number {
    return parseInt(process.env.RETRIES || '0', 10);
  }

  /**
   * Gets a custom environment variable
   * @param key - Environment variable key
   * @param defaultValue - Default value if not found
   * @returns Environment variable value or default
   */
  public static getEnvVar(key: string, defaultValue = ''): string {
    return process.env[key] || defaultValue;
  }
}
