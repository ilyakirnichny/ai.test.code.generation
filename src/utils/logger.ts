/**
 * ============================================
 * FILE: src/utils/logger.ts
 * PURPOSE: Custom logging utility for test framework
 * ============================================
 */

/**
 * Logger class for structured test logging
 * Provides different log levels for better debugging and reporting
 */
export class Logger {
  private context: string;

  /**
   * Creates a new Logger instance
   * @param context - Context identifier (e.g., test name, page name)
   */
  constructor(context: string) {
    this.context = context;
  }

  /**
   * Logs an informational message
   * @param message - Message to log
   * @param data - Optional data object
   */
  public info(message: string, data?: unknown): void {
    console.log(`[INFO] [${this.context}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  /**
   * Logs a warning message
   * @param message - Warning message to log
   * @param data - Optional data object
   */
  public warn(message: string, data?: unknown): void {
    console.warn(`[WARN] [${this.context}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  /**
   * Logs an error message
   * @param message - Error message to log
   * @param error - Optional error object
   */
  public error(message: string, error?: unknown): void {
    console.error(`[ERROR] [${this.context}] ${message}`, error instanceof Error ? error.stack : error);
  }

  /**
   * Logs a debug message
   * @param message - Debug message to log
   * @param data - Optional data object
   */
  public debug(message: string, data?: unknown): void {
    if (process.env.DEBUG) {
      console.debug(`[DEBUG] [${this.context}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  /**
   * Logs a step in the test execution
   * @param step - Step description
   */
  public step(step: string): void {
    console.log(`[STEP] [${this.context}] ➜ ${step}`);
  }
}
