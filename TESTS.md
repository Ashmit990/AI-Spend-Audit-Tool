# Testing Documentation

This project uses **Jest** and **ts-jest** for unit testing the core business logic. All tests reside in the `src/lib/__tests__/` directory.

## Core Test Suites

### 1. `audit.test.ts`
This is the primary test file for the Audit Engine. It covers:
- **Baseline Accuracy:** Ensures math is correct for a simple single-tool setup.
- **Seat Over-provisioning:** Verifies that the engine correctly flags excess seats based on team size.
- **Plan Right-sizing:** Checks if the engine suggests downgrades for small teams (≤3 people).
- **Double-billing Detection:** Specifically tests the overlap between Claude/Anthropic API and ChatGPT/OpenAI API.
- **Bulk Discount Logic:** Verifies the 15% savings calculation for direct API users via Credex.
- **Credex Upsell Flag:** Triggers only when monthly savings ≥ $50.
- **"Already Optimal" Flag:** Triggers when savings are negligible (< $5).

### 2. `pricing.test.ts`
Verifies the pricing schema integrity.
- **Schema Validation:** Ensures all 8 tools have at least one plan.
- **Cost Integrity:** Checks that costs are numeric and non-negative.
- **Lookup Accuracy:** Verifies the helper functions for retrieving plan details by name.

### 3. `validate.test.ts`
Tests the input validation layer for API routes.
- **Team Size Bounds:** Ensures team size is a positive integer.
- **Tool List Limits:** Prevents over-sized or empty tool arrays.
- **String Sanitization:** Checks for name length limits and character escaping.

## How to Run Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Generate Coverage Report
```bash
npm test -- --coverage
```

## Minimum 5 Required Audit Engine Tests
*As specified in the project requirements, these specific cases are covered in `audit.test.ts`:*
1.  **Correct savings calculation:** Verified in the "Baseline Accuracy" case.
2.  **Plan downgrade suggestion:** Verified when `teamSize <= 2`.
3.  **Plan upgrade suggestion:** Verified for "Value" plans with `teamSize > 10`.
4.  **Credex upsell flag:** Verified to trigger at >$500/mo spend (or >$50/mo savings).
5.  **"Spending well" flag:** Verified to trigger at <$100/mo total spend with <$5 savings.
