# Exercise: Copilot in Existing Frameworks

## Task

Extend an existing Page Object Model framework by introducing a new UI element (dropdown), following all conventions already established in the project. Use GitHub Copilot to generate code that fits seamlessly into the existing structure.

---

## What Was Done

### 1. New Page Object — `DropdownPage`

**File:** `src/pages/DropdownPage.ts`

Added a new Page Object for the Dropdown page (`/dropdown`) following the exact same conventions as `CheckboxesPage` and `LoginPage`:

- Extends `BasePage`
- `protected pageUrl` for navigation
- `private readonly` locator defined in constructor using stable `#dropdown` id selector
- All public methods have explicit return types and JSDoc
- `this.logger.step()` for every user-visible action
- `waitForElement()` called before interacting with the element
- `assertXxx()` methods for assertions (matching the `assertChecked` / `assertUnchecked` pattern from `CheckboxesPage`)

**Methods added:**

| Method | Description |
|---|---|
| `selectOption(label)` | Selects an option by its visible text label |
| `getSelectedOption()` | Returns the currently selected option's value |
| `getAvailableOptions()` | Returns all non-disabled option labels |
| `assertSelectedValue(value)` | Asserts the dropdown has the expected value |
| `assertDropdownVisible()` | Asserts the dropdown is visible and enabled |

---

### 2. Fixture Registration — `BaseTest.ts`

**File:** `src/fixtures/BaseTest.ts`

Registered `dropdownPage` fixture following the same pattern as `checkboxesPage`, `loginPage`, and `homePage`:

```typescript
dropdownPage: async ({ page }, use) => {
  await use(new DropdownPage(page));
},
```

No manual `new DropdownPage(page)` instantiation needed in tests.

---

### 3. New Test Suite — `dropdown.spec.ts`

**File:** `tests/e2e/dropdown.spec.ts`

5 tests covering the dropdown element, following the same structure as `checkboxes.spec.ts`:

- `beforeEach` calls `dropdownPage.navigate()` — no duplicated navigation
- Test sections annotated: `// Initialization`, `// User actions`, `// Verification`
- Descriptive test names that state expected outcomes
- Assertions use Page Object methods (`assertSelectedValue`) — no inline `expect` on raw locators

**Tests:**

| # | Test | Result |
|---|---|---|
| 1 | should display the dropdown on the page | ✅ passed |
| 2 | should select Option 1 from the dropdown | ✅ passed |
| 3 | should select Option 2 from the dropdown | ✅ passed |
| 4 | should change selection from Option 1 to Option 2 | ✅ passed |
| 5 | should list the correct available options | ✅ passed |

---

## Prompt Pattern Used

```
Context:
- Framework: TypeScript + Playwright POM
- Existing pages: BasePage, CheckboxesPage, LoginPage, HomePage
- Conventions: extend BasePage, private readonly locators in constructor,
  logger.step() for actions, waitForElement() before interactions,
  assertXxx() for assertions, explicit return types on all methods

Task:
- Add DropdownPage for /dropdown (outerHTML: <select id="dropdown">...)
- Methods must follow the same pattern as CheckboxesPage
- Register fixture in BaseTest.ts
- Write tests with // Initialization / // User actions / // Verification comments

Constraints:
- Stable selector: #dropdown id attribute
- No inline locators in tests
- No CSS/XPath selectors
- No manual page instantiation in tests
```

---

## Test Run Results

```
Running 21 tests using 1 worker · Chromium (Desktop Chrome)

✅  5  Checkboxes Tests
✅  5  Dropdown Tests
✅  6  Home Page Tests
✅  5  Login Tests

21 passed (56.3s)
```
