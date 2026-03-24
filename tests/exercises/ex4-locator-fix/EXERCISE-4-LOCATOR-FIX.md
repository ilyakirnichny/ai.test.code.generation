# Exercise 4 — Locator Fix

## Context

UI updates break selectors. The right response is a **surgical, narrow fix** — update only the broken locator, leave all class and method signatures untouched. This exercise practices writing scoped prompts that prevent Copilot from over-generating or rewriting unrelated code.

**Target site:** [saucedemo.com](https://www.saucedemo.com) — product detail page (`/inventory-item.html`).

---

## The Scenario

After a saucedemo UI update, two locators in `ProductPage.ts` broke:

| What broke | Old (broken) selector | New (correct) selector |
|---|---|---|
| Add-to-cart button | `.btn_primary` (CSS class removed) | `[data-test^="add-to-cart"]` |
| Product price | `//div[@class="inventory_details_price"]` (XPath, class renamed) | `[data-test="inventory-item-price"]` |

**Before (broken) state:**
```typescript
// ❌ BUGGY — old CSS class no longer exists
this.addToCartButton = this.page.locator('.btn_primary');

// ❌ BUGGY — XPath, fragile class name
this.productPrice = this.page.locator('//div[@class="inventory_details_price"]');
```

**After (fixed) state:**
```typescript
// ✅ FIXED — stable data-test prefix, works for any product
this.addToCartButton = this.page.locator('[data-test^="add-to-cart"]');

// ✅ FIXED — stable data-test attribute
this.productPrice = this.page.locator('[data-test="inventory-item-price"]');
```

---

## Prompt Used

```
Context:
- Framework: TypeScript + Playwright, Page Object Model
- File to fix: src/pages/ProductPage.ts
- Convention: all locators must use [data-test] attributes — no CSS class selectors, no XPath

Problem:
Two locators are outdated after a UI update:

1. addToCartButton uses `.btn_primary` — this CSS class was removed.
   outerHTML of the new button:
   <button class="btn btn_primary btn_small btn_inventory"
           data-test="add-to-cart-sauce-labs-backpack" id="add-to-cart-sauce-labs-backpack">
     Add to cart
   </button>

2. productPrice uses XPath `//div[@class="inventory_details_price"]` — class was renamed.
   outerHTML of the new price element:
   <div class="inventory_details_price" data-test="inventory-item-price">$29.99</div>

Fix:
- Replace addToCartButton locator with: page.locator('[data-test^="add-to-cart"]')
  (prefix match — works for any product, not just backpack)
- Replace productPrice locator with: page.locator('[data-test="inventory-item-price"]')
- DO NOT modify any other locators, method bodies, comments, or class structure
- Output the corrected constructor block only
```

---

## What Was Built

### `src/pages/ProductPage.ts`
New Page Object for the product detail page — created first with the **buggy locators** to represent the pre-fix state, then patched.

Only two lines changed inside the `constructor`:

```diff
- this.addToCartButton = this.page.locator('.btn_primary');
+ this.addToCartButton = this.page.locator('[data-test^="add-to-cart"]');

- this.productPrice = this.page.locator('//div[@class="inventory_details_price"]');
+ this.productPrice = this.page.locator('[data-test="inventory-item-price"]');
```

All method signatures (`addToCart()`, `getProductPrice()`, `assertPriceVisible()`, etc.) remain completely unchanged.

---

### `tests/exercises/ex4-locator-fix/product.spec.ts` — 4 tests

These tests would **fail** with the old locators and **pass** with the fixed ones — proving the patch works.

| # | Test | Validates |
|---|---|---|
| 1 | Product name + price visible on detail page | Fixed `productPrice` locator |
| 2 | Add to cart from detail page — badge increments | Fixed `addToCartButton` locator |
| 3 | Navigate back to inventory from detail page | `backButton` (unchanged) |
| 4 | Correct product name shown on detail page | `productName` (unchanged) |

---

## Test Run Results

```
Running 4 tests using 1 worker · Chromium (Desktop Chrome)

✅  4  Product Page — Locator Fix Verification

4 passed (21.4s)
```

Full suite after adding this exercise: **40 passed**.

---

## Key Decisions

- **`[data-test^="add-to-cart"]` prefix match** — the full `data-test` value is product-specific (`add-to-cart-sauce-labs-backpack`). Using `^=` (starts-with) makes the locator work for any product on the detail page without hardcoding a name.
- **Provided `outerHTML` in the prompt** — giving Copilot the actual DOM ensures it picks the right attribute and doesn't guess a class name or role.
- **"Do not modify unrelated code"** in the prompt — prevents Copilot from refactoring methods, renaming variables, or adding unsolicited improvements.
- **Only the constructor changed** — all 7 method bodies, JSDoc comments, and the class structure are byte-for-byte identical to the broken version. This is the expected output for a locator-only fix.
