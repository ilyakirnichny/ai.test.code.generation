# Exercise 2 — Checkout Flow (Cart + Total)

## Context

Checkout flows test business-critical revenue paths. This exercise structures a multi-step scenario across dedicated Page Objects and a reusable component, keeping specs readable and free of raw selectors.

**Target site:** [saucedemo.com](https://www.saucedemo.com) — purpose-built demo store with login → inventory → cart → checkout flow.

---

## Prompt Used

```
Context:
- Stack: TypeScript + Playwright, Page Object Model
- Existing base: BasePage (extend this), BaseComponent (extend this), BaseTest fixtures
- Conventions:
    - extends BasePage, absolute pageUrl for cross-origin pages
    - private readonly locators in constructor using data-test attributes
    - waitForElement() before interactions
    - logger.step() for every user-visible action
    - assertXxx() methods — no inline expect in tests
    - explicit return types and JSDoc on all public methods
    - test data in fixtures — never hardcoded in specs

Task:
1. src/fixtures/checkoutTestData.ts
   - sauceStandardUser: { username, password }
   - sauceProducts: { backpack, bikeLight } with name + price
   - checkoutInfo: { firstName, lastName, zip }

2. src/components/CartBadge.ts (Header equivalent)
   - extends BaseComponent, rootLocator = .shopping_cart_link
   - getBadgeCount(): number
   - assertBadgeCount(expected): checks badge text or absence
   - clickCart(): navigates to cart page

3. src/pages/SauceLoginPage.ts (Login for saucedemo)
   - pageUrl = 'https://www.saucedemo.com/'
   - login(username, password): fill + submit
   - assertErrorContains(text)

4. src/pages/InventoryPage.ts (SearchPage equivalent)
   - pageUrl = 'https://www.saucedemo.com/inventory.html'
   - addToCart(productName): find card by name, click add button
   - getProductPrice(productName)
   - assertPageVisible(), assertAddedToCart(productName)

5. src/pages/CartPage.ts
   - pageUrl = 'https://www.saucedemo.com/cart.html'
   - proceedToCheckout()
   - assertContainsItem(productName), assertItemCount(n)

6. src/pages/CheckoutInfoPage.ts
   - fillAndContinue(info: CheckoutInfo)
   - assertPageVisible()

7. src/pages/OrderSummaryPage.ts (CheckoutPage equivalent)
   - getItemTotal(), getTax(), getTotal()
   - finish()
   - assertItemTotalContains(price), assertTotalContains(total)
   - assertOrderComplete()

8. Register all fixtures in src/fixtures/BaseTest.ts
   (do NOT duplicate pattern — add after secureAreaPage fixture)

9. tests/exercises/ex2-checkout-flow/checkout.spec.ts
   - import CartBadge from component (instantiate with page fixture)
   - import all data from checkoutTestData
   - beforeEach: sauceLoginPage.navigate() + login() + assertPageVisible()
   - Sections: // Initialization / // User actions / // Verification

Constraints:
- Stable selectors: data-test attributes, class-based (.shopping_cart_badge, .summary_total_label)
- No hardcoded prices or credentials in spec
- CartBadge component spans all pages → instantiate from page in test (not a page fixture)
- assertBadgeCount(0) must check badge is NOT visible (empty cart has no badge)
```

---

## What Was Built

### `src/fixtures/checkoutTestData.ts`

| Export | Description |
|---|---|
| `sauceStandardUser` | `{ username: 'standard_user', password: 'secret_sauce' }` |
| `sauceProducts.backpack` | `{ name: 'Sauce Labs Backpack', price: '$29.99' }` |
| `sauceProducts.bikeLight` | `{ name: 'Sauce Labs Bike Light', price: '$9.99' }` |
| `checkoutInfo` | `{ firstName: 'Test', lastName: 'User', zip: '12345' }` |

---

### `src/components/CartBadge.ts` — Header equivalent

| Method | Description |
|---|---|
| `getBadgeCount()` | Returns badge count as number; 0 if badge is absent |
| `assertBadgeCount(n)` | Asserts badge text equals n; if 0, asserts badge is not visible |
| `clickCart()` | Clicks the cart icon to open cart page |

---

### Page Objects

| File | `pageUrl` | Key Methods |
|---|---|---|
| `SauceLoginPage.ts` | `https://www.saucedemo.com/` | `login()`, `assertErrorContains()` |
| `InventoryPage.ts` | `/inventory.html` | `addToCart(name)`, `assertAddedToCart(name)`, `assertPageVisible()` |
| `CartPage.ts` | `/cart.html` | `proceedToCheckout()`, `assertContainsItem(name)`, `assertItemCount(n)` |
| `CheckoutInfoPage.ts` | `/checkout-step-one.html` | `fillAndContinue(info)`, `assertPageVisible()` |
| `OrderSummaryPage.ts` | `/checkout-step-two.html` | `assertItemTotalContains()`, `assertTotalContains()`, `finish()`, `assertOrderComplete()` |

---

### `tests/exercises/ex2-checkout-flow/checkout.spec.ts` — 4 tests

| # | Test | Result |
|---|---|---|
| 1 | should add a product to cart and increment the cart badge | ✅ passed |
| 2 | should add two products and show badge count of 2 | ✅ passed |
| 3 | should show added product in the cart | ✅ passed |
| 4 | should complete full checkout flow and verify order total | ✅ passed |

---

## Test Run Results

```
Running 4 tests using 1 worker · Chromium (Desktop Chrome)

✅  4  Checkout Flow

4 passed (26.0s)
```

Full suite after adding this exercise: **30 passed**.

---

## Key Decisions

- **Separate site (saucedemo.com)** — `the-internet.herokuapp.com` has no cart/checkout. Saucedemo is purpose-built for this scenario. Absolute `pageUrl` values let `BasePage.navigate()` work unchanged across origins.
- **CartBadge as a component** — the badge lives in the header, available on every page. It's not a page, so it extends `BaseComponent` and is instantiated from `page` in the test — not registered as a page fixture.
- **`assertBadgeCount(0)` checks absence** — empty carts show no badge at all (not a `0` badge). The assertion explicitly checks `not.toBeVisible()` for zero.
- **`filter({ hasText })` for product lookup** — finds the product card by name text, then scopes the add-to-cart button within it, avoiding fragile nth-element indexing.
- **Tax pre-calculated in checkoutTestData** — `$29.99 + $9.99 = $39.98` subtotal, `$3.20` tax (8%), `$43.18` total. Values match saucedemo's fixed tax rate.
