# Playwright Test Automation Framework

TypeScript + Playwright e2e framework using Page Object Model (POM).  
Target: **https://the-internet.herokuapp.com**

## Stack

- [Playwright Test](https://playwright.dev) — test runner
- TypeScript — strict mode
- Node.js 18+

## Structure

```
src/
  components/
    BaseComponent.ts     # Abstract base for UI components
  fixtures/
    BaseTest.ts          # Custom test with logger, loginPage, homePage, checkboxesPage, dropdownPage fixtures
  pages/
    BasePage.ts          # Abstract base with common page methods
    CheckboxesPage.ts    # Checkboxes page (/checkboxes)
    DropdownPage.ts      # Dropdown page (/dropdown)
    HomePage.ts          # Home page (/)
    LoginPage.ts         # Login page (/login)
  utils/
    envHelper.ts         # Environment variable helpers
    logger.ts            # Structured logger (info / warn / error / step / debug)
tests/e2e/
  checkboxes.spec.ts     # Checkboxes tests (5)
  dropdown.spec.ts       # Dropdown tests (5)
  home.spec.ts           # Home page tests (6)
  login.spec.ts          # Login / logout tests (5)
playwright.config.ts
```

## Setup

```bash
npm install
npx playwright install
cp .env.example .env
```

## Run

```bash
# All tests, 1 worker, Chromium
npx playwright test --project=chromium --workers=1

# Headed
npx playwright test --headed --project=chromium

# UI mode
npx playwright test --ui

# HTML report
npx playwright show-report
```

## Test Results

| Suite | Tests | Status |
|---|---|---|
| Checkboxes | 5 | ✅ passed |
| Dropdown | 5 | ✅ passed |
| Home Page | 6 | ✅ passed |
| Login | 5 | ✅ passed |
| **Total** | **21** | **✅ all passed** |

Browser: Chromium (Desktop Chrome) · Workers: 1

## Conventions

- Selectors: `getByRole`, `getByLabel`, `getByTestId`, stable id/attribute selectors — no CSS/XPath
- PascalCase classes, camelCase methods
- Every class and public method has JSDoc
- Pages extend `BasePage`, components extend `BaseComponent`
- Fixtures in `BaseTest.ts` — import `{ test, expect }` from there in every spec
- Test sections annotated with `// Initialization`, `// User actions`, `// Verification`

## Exercises

- [Copilot in Existing Frameworks](EXERCISE-COPILOT-IN-EXISTING-FRAMEWORKS.md)
