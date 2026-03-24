# Exercise 3 — Search with Filters

## Context

Filtering and sorting result sets is a classic regression scenario. The key challenge is **asserting across the full collection** — not just checking the first item. This exercise extends an existing Page Object with collection helpers and a sort/filter action, keeping the spec readable and the assertions data-driven.

**Target site:** [saucedemo.com](https://www.saucedemo.com) — inventory page with a built-in sort dropdown.

---

## Prompt Used

```
Context:
- Stack: TypeScript + Playwright, Page Object Model
- Existing page: InventoryPage (src/pages/InventoryPage.ts)
  — do NOT create a new SearchPage or ResultsPage; extend InventoryPage
- Existing conventions:
    - private readonly locators in constructor
    - logger.step() for every user-visible action
    - waitForElement() before interacting
    - assertXxx() collection methods — no inline expect on raw locators in tests
    - explicit return types and JSDoc on all public methods

Task:
1. src/fixtures/searchTestData.ts
   - SortOption const object: { NAME_A_TO_Z, NAME_Z_TO_A, PRICE_LOW_HIGH, PRICE_HIGH_LOW }
     values match <option value="..."> attributes of [data-test="product-sort-container"]
   - priceThresholds: { allProducts: 50, mostProducts: 30 }
   - expectedNamesAtoZ: string[] — full A→Z product name list

2. Extend src/pages/InventoryPage.ts (do NOT duplicate):
   - Add sortDropdown locator: [data-test="product-sort-container"]
   - applySort(option: SortOption): waitForElement + selectOption
   - getAllProductNames(): string[]  — .inventory_item_name allInnerTexts()
   - getAllPrices(): number[] — .inventory_item_price allInnerTexts(), strip '$', parseFloat
   - assertAllPricesBelow(maxPrice): loops getAllPrices(), expect each < maxPrice
     with descriptive message — assert for ALL items, not just one
   - assertPricesSortedAscending(): loops pairs, expect prices[i] <= prices[i+1]
   - assertPricesSortedDescending(): loops pairs, expect prices[i] >= prices[i+1]
   - assertNamesOrderEqual(expected): expect(actual).toEqual(expected)

3. tests/exercises/ex3-search-filters/search.spec.ts
   - import all data from searchTestData
   - beforeEach: login + assertPageVisible
   - Sections: // Initialization / // User actions / // Verification
   - 6 tests covering: raw listing price check, low→high sort, high→low sort,
     A→Z names, Z→A names, filter + collect prices below threshold

Constraints:
- No hardcoded sort values or price numbers in the spec
- assertAllPricesBelow MUST loop every item — not just the first
- assertPricesSorted MUST check every consecutive pair
- Descriptive expect messages: "Expected $X to be below $Y"
```

---

## What Was Built

### `src/fixtures/searchTestData.ts`

| Export | Value |
|---|---|
| `SortOption.NAME_A_TO_Z` | `'az'` |
| `SortOption.NAME_Z_TO_A` | `'za'` |
| `SortOption.PRICE_LOW_HIGH` | `'lohi'` |
| `SortOption.PRICE_HIGH_LOW` | `'hilo'` |
| `priceThresholds.allProducts` | `50` — all 6 products qualify |
| `priceThresholds.mostProducts` | `30` — 5 of 6 qualify |
| `expectedNamesAtoZ` | Full alphabetical name list |

---

### `src/pages/InventoryPage.ts` — extended (not duplicated)

New additions:

| Addition | Description |
|---|---|
| `sortDropdown` locator | `[data-test="product-sort-container"]` |
| `applySort(option)` | Applies a sort filter from the dropdown |
| `getAllProductNames()` | Returns all visible product names as `string[]` |
| `getAllPrices()` | Returns all prices as `number[]` (strips `$`) |
| `assertAllPricesBelow(max)` | Loops **every** price; fails with descriptive message if any ≥ max |
| `assertPricesSortedAscending()` | Checks every consecutive pair `[i] <= [i+1]` |
| `assertPricesSortedDescending()` | Checks every consecutive pair `[i] >= [i+1]` |
| `assertNamesOrderEqual(expected)` | Deep-equals actual name array to expected |

---

### `tests/exercises/ex3-search-filters/search.spec.ts` — 6 tests

| # | Test | Assertion type | Result |
|---|---|---|---|
| 1 | All products listed — every price below $50 | Loop all prices | ✅ passed |
| 2 | Sort by price low→high — ascending order | Check every pair | ✅ passed |
| 3 | Sort by price high→low — descending order | Check every pair | ✅ passed |
| 4 | Sort by name A→Z — alphabetical order | Deep-equals full list | ✅ passed |
| 5 | Sort by name Z→A — reverse alphabetical | Reversed expected list | ✅ passed |
| 6 | Price filter: collect prices < $30 from sorted result | Loop filtered subset | ✅ passed |

---

## Test Run Results

```
Running 6 tests using 1 worker · Chromium (Desktop Chrome)

✅  6  Search with Filters

6 passed (35.0s)
```

Full suite after adding this exercise: **36 passed**.

---

## Key Decisions

- **Extended `InventoryPage`, not a new page** — saucedemo's sort lives on the same inventory page. Creating a separate `SearchPage` and `ResultsPage` would have duplicated all existing locators. The exercise template's `applyFilter()` maps to `applySort()` on the existing page.
- **`getAllPrices()` returns `number[]`** — stripping `$` and parsing to float lets the loop assertions use numeric comparisons (`toBeLessThan`, `toBeGreaterThanOrEqual`) instead of fragile string comparisons.
- **Descriptive `expect` messages** — `expect(price, "Expected $X to be below $Y")` shows the exact failing value in the error output, rather than just `Expected: < 30; Received: 49.99`.
- **Consecutive-pair loop for sort assertions** — checks every `[i] <= [i+1]` pair rather than comparing to a fixed expected array, making the assertion robust even if saucedemo adds new products.
- **`expectedNamesAtoZ` in `searchTestData`** — name order is data, not logic. Keeping it in fixtures means a product name change requires editing one file, not hunting through tests.
