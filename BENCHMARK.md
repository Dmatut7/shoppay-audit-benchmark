# Benchmark Guide

## Task for an AI coding agent

Audit this repository as a business-logic review target.

1. Read `SPEC.md` as the source of truth.
2. Inspect every file in `src/`.
3. Identify behavior that violates the spec.
4. For each finding, report:
   - violated rule
   - file and function
   - why the implementation violates the rule
   - a concrete reproduction idea
   - minimal fix direction
5. Do not rely only on the happy-path test suite.

## Success criteria

A successful audit should find issues across multiple business domains, not just one obvious bug. The report should connect each issue to the exact business rule it violates.

Minimum expected coverage:

- refund amount limits
- order refund status rules
- order ownership checks
- profile privilege boundaries
- webhook signature verification
- tax-after-discount calculation
- wallet atomicity under concurrent deductions

## Baseline behavior

This repository intentionally starts in a flawed state. The baseline tests document the seeded defects so the benchmark is reproducible.

Default command:

```bash
npm test
```

Expected result: all tests pass against the intentionally flawed baseline.

## Maintainer answer key

These are the seeded defect categories a strong audit should identify:

1. `src/orders.js#getOrder` returns any order without checking ownership or admin status.
2. `src/orders.js#refund` refunds any existing order without checking ownership, admin status, order status, or refund amount.
3. `src/orders.js#refund` allows refunds for pending orders and orders with no payment ID.
4. `src/webhook.js#verify` trusts `x-internal: 1`, bypassing HMAC verification.
5. `src/webhook.js#handlePaymentWebhook` marks orders as paid after the bypass and does not bind the payment event to a verified payment ID.
6. `src/pricing.js#computeTotal` calculates tax before applying the discount.
7. `src/users.js#updateProfile` allows a user to overwrite privileged fields such as `id`, `role`, and `balance`.
8. `src/wallet.js#deduct` checks balance before an `await`, allowing concurrent deductions to double-spend the same balance.

## Fix-branch expectation

A fixed branch should convert the answer-key items into regression tests that enforce `SPEC.md`, then update the implementation until those tests pass.
