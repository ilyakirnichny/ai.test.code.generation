# Playwright Test Automation Framework

TypeScript + Playwright e2e framework using Page Object Model (POM).  
Targets: **https://the-internet.herokuapp.com** · **https://www.saucedemo.com**

## Stack

- [Playwright Test](https://playwright.dev) — test runner
- TypeScript — strict mode
- Node.js 18+

## Structure

```
src/
  components/
    BaseComponent.ts      # Abstract base for UI components
    CartBadge.ts          # Cart badge component (saucedemo)
  fixtures/
    BaseTest.ts           # Central fixture registry
    authTestData.ts       # Auth credentials / expected values
    checkoutTestData.ts   # Checkout form data and expected totals
    searchTestData.ts     # Sort options, price thresholds, expected order
  pages/
    BasePage.ts           # Abstract base with common page methods
    CheckboxesPage.ts     # /checkboxes
    DropdownPage.ts       # /dropdown
    HomePage.ts           # /
    LoginPage.ts          # /login
    SecureAreaPage.ts     # /secure
    SauceLoginPage.ts     # saucedemo login
    InventoryPage.ts      # saucedemo product list (sort + collection helpers)
    ProductPage.ts        # saucedemo product detail
    CartPage.ts           # saucedemo cart
    CheckoutInfoPage.ts   # saucedemo checkout step 1
    OrderSummaryPage.ts   # saucedemo checkout step 2 / confirmation
  utils/
    dateHelper.ts         # Date formatting / parsing helpers
    envHelper.ts          # Environment variable helpers
    logger.ts             # Structured logger (info / warn / error / step / debug)
tests/
  e2e/
    checkboxes.spec.ts    # 5 tests
    dropdown.spec.ts      # 5 tests
    home.spec.ts          # 6 tests
    login.spec.ts         # 5 tests
  exercises/
    ex1-auth-flow/        # 5 tests — auth positive + negative
    ex2-checkout-flow/    # 4 tests — cart badge, cart contents, full checkout
    ex3-search-filters/   # 6 tests — sort directions, price filter
    ex4-locator-fix/      # 4 tests — fixed CSS/XPath → data-test selectors
    ex5-utility-fix/      # 21 tests — dateHelper null/undefined guards
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
# All tests (1 worker, Chromium)
npx playwright test --workers=1

# Single exercise
npx playwright test tests/exercises/ex5-utility-fix --workers=1

# Headed
npx playwright test --headed

# HTML report
npx playwright show-report
```

## Test Results

| Suite | Tests | Status |
|---|---|---|
| Checkboxes | 5 | ✅ |
| Dropdown | 5 | ✅ |
| Home Page | 6 | ✅ |
| Login | 5 | ✅ |
| Ex1 — Auth flow | 5 | ✅ |
| Ex2 — Checkout flow | 4 | ✅ |
| Ex3 — Search filters | 6 | ✅ |
| Ex4 — Locator fix | 4 | ✅ |
| Ex5 — Utility fix | 21 | ✅ |
| **Total** | **61** | **✅ all passed** |

Browser: Chromium (Desktop Chrome) · Workers: 1

## Conventions

- Selectors: `getByRole`, `getByLabel`, `getByTestId`, stable `data-test` attributes — no fragile CSS classes or XPath
- PascalCase classes, camelCase methods
- Every class and public method has JSDoc
- Pages extend `BasePage`, components extend `BaseComponent`
- All fixtures registered in `BaseTest.ts` — import `{ test, expect }` from there in every spec
- Test sections annotated with `// Initialization`, `// User actions`, `// Verification`

## Exercises

- [Copilot in Existing Frameworks](EXERCISE-COPILOT-IN-EXISTING-FRAMEWORKS.md)
