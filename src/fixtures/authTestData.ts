/**
 * ============================================
 * FILE: src/fixtures/authTestData.ts
 * PURPOSE: Test data for authentication flows
 *
 * Centralises credentials so tests never hardcode user data.
 * Source values come from environment variables (see .env.example)
 * with sensible defaults for the-internet.herokuapp.com demo site.
 * ============================================
 */

export interface UserCredentials {
  username: string;
  password: string;
}

/**
 * Valid user — should reach the secure area on login.
 */
export const validUser: UserCredentials = {
  username: process.env.TEST_USERNAME ?? 'tomsmith',
  password: process.env.TEST_PASSWORD ?? 'SuperSecretPassword!',
};

/**
 * User with a wrong password — login must be rejected.
 */
export const invalidPasswordUser: UserCredentials = {
  username: process.env.TEST_USERNAME ?? 'tomsmith',
  password: 'wrongpassword',
};

/**
 * Completely unknown user — login must be rejected.
 */
export const unknownUser: UserCredentials = {
  username: 'notauser',
  password: 'notapassword',
};
