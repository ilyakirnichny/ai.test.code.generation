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
    BaseTest.ts          # Custom test with logger, loginPage, homePage fixtures
  pages/
    BasePage.ts          # Abstract base with common page methods
    HomePage.ts          # Home page (/)
    LoginPage.ts         # Login page (/login)
  utils/
    envHelper.ts         # Environment variable helpers
    logger.ts            # Structured logger (info / warn / error / step / debug)
tests/e2e/
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

## Conventions

- Selectors: `getByRole`, `getByLabel`, `getByTestId` only — no CSS/XPath
- PascalCase classes, camelCase methods
- Every class and public method has JSDoc
- Pages extend `BasePage`, components extend `BaseComponent`
- Fixtures in `BaseTest.ts` — import `{ test, expect }` from there in every spec
