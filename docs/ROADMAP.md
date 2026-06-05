# Roadmap

## Current scope

- Compact ShopPay domain with orders, refunds, users, wallet, pricing, and payment webhooks.
- Reproducible baseline tests for seeded business-logic defects.
- Audit guide and maintainer answer key for evaluating AI coding agents.

## Next benchmark cases

1. Partial-refund accounting across multiple refunds.
2. Coupon ownership and reuse limits.
3. Idempotent payment webhook replay handling.
4. Admin-only balance adjustment workflow.
5. Multi-currency rounding and tax rules.
6. Fix-branch examples with regression tests for each seeded defect.

## Maintainer goals

- Keep the default branch small enough for quick Codex audit runs.
- Add realistic business invariants one at a time.
- Track agent audit quality by whether reports cite `SPEC.md` and exact source functions.
