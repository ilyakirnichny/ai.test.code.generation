# Exercise 1 — Auth Flow (Positive + Negative)

## Context

Authentication flows are the backbone of most applications. Every regression suite must verify both valid and invalid login attempts. This exercise adapts the prompt pattern to test a core auth flow step-by-step, reusing existing Page Objects and applying stable selectors.

---

## Prompt Used

```
Context:
- Stack: TypeScript + Playwright, Page Object Model
- Existing pages: BasePage, LoginPage, HomePage
- Fixtures: BaseTest.ts (provides page objects via dependency injection)
- Conventions:
    - extend BasePage
    - private readonly locators defined in constructor
    - logger.step() for every user-visible action
    - waitForElement() before interactions
    - assertXxx() methods for assertions
    - explicit return types on all public methods
    - credentials from fixtures — never hardcoded in tests

Task:
1. Create src/fixtures/authTestData.ts with:
   - validUser, invalidPasswordUser, unknownUser
   - values from process.env with fallback defaults

2. Create src/pages/SecureAreaPage.ts (the page after successful login):
   - extend BasePage, pageUrl = '/secure'
   - private readonly locators: heading, flashAlert, logoutLink
   - assertAuthenticatedHeadingVisible() — equivalent to "avatar visible"
   - assertLogoutVisible()
   - assertWelcomeMessageContains(text)
   - getWelcomeMessage()

3. Register secureAreaPage fixture in src/fixtures/BaseTest.ts
   (do not duplicate existing fixtures — follow the same pattern)

4. Create tests/exercises/ex1-auth-flow/auth.spec.ts:
   - import { test, expect } from BaseTest fixture
   - import credentials from authTestData (not hardcoded)
   - beforeEach: navigate to login page
   - Sections annotated: // Initialization / // User actions / // Verification
   - Positive: valid login → assertAuthenticatedHeadingVisible + assertLogoutVisible
   - Negative: wrong password, unknown user, empty credentials → assertAlertContains

Constraints:
- Do NOT create a new LoginPage — import from src/pages/LoginPage.ts
- Stable locators: getByRole with exact:true for headings, #flash for alert
- No inline expect on raw locators in tests
- No manual page instantiation in tests (use fixtures)
```

---

## What Was Built

### `src/fixtures/authTestData.ts`
Centralised credentials — never hardcoded in the spec:

| Export | Description |
|---|---|
| `validUser` | Username + password from env vars (fallback: `tomsmith` / `SuperSecretPassword!`) |
| `invalidPasswordUser` | Valid username, wrong password |
| `unknownUser` | Non-existent username and password |

---

### `src/pages/SecureAreaPage.ts`
Page Object for `/secure` — the authenticated area the user lands on after login.

Equivalent to the `avatar()` method from the exercise template.

| Method | Description |
|---|---|
| `assertAuthenticatedHeadingVisible()` | Asserts the `<h2>Secure Area</h2>` heading is visible |
| `assertLogoutVisible()` | Asserts the logout link is present — confirms authenticated session |
| `assertWelcomeMessageContains(text)` | Asserts the flash message contains expected text |
| `getWelcomeMessage()` | Returns the flash message text (strips × char) |
| `isLogoutVisible()` | Returns boolean — logout link visibility |

---

### `src/fixtures/BaseTest.ts` (updated)
`secureAreaPage` fixture registered following the same pattern as all other fixtures.

---

### `tests/exercises/ex1-auth-flow/auth.spec.ts`
5 tests, all using fixtures — no manual page instantiation, no hardcoded credentials.

| # | Test | Type | Result |
|---|---|---|---|
| 1 | should log in with valid credentials and reach the secure area | ✅ Positive | passed |
| 2 | should show the logout link after a successful login | ✅ Positive | passed |
| 3 | should show an error for an invalid password | ❌ Negative | passed |
| 4 | should show an error for an unknown username | ❌ Negative | passed |
| 5 | should remain on the login page with empty credentials | ❌ Negative | passed |

---

## Test Run Results

```
Running 5 tests using 1 worker · Chromium (Desktop Chrome)

✅  2  Auth Flow — positive
✅  3  Auth Flow — negative

5 passed (27.7s)
```

Full suite after adding this exercise: **26 passed**.

---

## Key Decisions

- **No new LoginPage** — the existing `LoginPage.login()`, `loginAndGoToSecureArea()`, and `assertAlertContains()` methods covered all needs without modification.
- **Credentials in `authTestData.ts`** — single source of truth; changing a test password requires editing one file, not hunting through specs.
- **`SecureAreaPage` instead of `HomePage`** — the site redirects to `/secure`, not `/home`, after login. The heading visibility check is the reliable "logged in" indicator on this site.
- **Exact heading selector** — `/secure area/i` matched two headings on the page; switched to `{ name: 'Secure Area', exact: true }` to resolve the strict-mode violation.
