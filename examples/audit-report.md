# Example Audit Report

This is a sample report format for ShopPay Audit Benchmark. It is intentionally concise so agent outputs can be compared consistently.

## Summary

The implementation violates core business rules in order access, refunds, webhook trust, user profile updates, pricing, and wallet deduction. The highest-impact issues are unauthorized refunds, unsigned webhook payment approval, and wallet double-spend.

## Findings

### 1. Cross-user order read

- Rule: A user may read only their own orders. Admins may read any order.
- File/function: `src/orders.js#getOrder`
- Problem: The function returns any order by ID without checking `req.user`.
- Reproduction idea: Call `getOrder` as user `u1` for order `o2`; the function returns Bob's order.
- Fix direction: Require same `order.userId` as `req.user.id`, unless `isAdmin(req.user)` is true.

### 2. Cross-user refund

- Rule: A user may refund only their own orders. Admins may refund any order.
- File/function: `src/orders.js#refund`
- Problem: The function refunds any existing order without ownership or admin checks.
- Reproduction idea: Call `refund` as user `u2` for order `o1`; the refund succeeds.
- Fix direction: Add the same ownership/admin check before calling the gateway.

### 3. Refund lifecycle bypass

- Rule: An order may be refunded only when `status === "paid"`.
- File/function: `src/orders.js#refund`
- Problem: Pending orders can be refunded.
- Reproduction idea: Call `refund` for `o2`, which starts as `pending`; the function returns status 200.
- Fix direction: Reject any order whose status is not `paid`.

### 4. Over-refund

- Rule: A refund amount must not exceed the order's `capturedAmount`.
- File/function: `src/orders.js#refund`
- Problem: The requested amount is passed to the gateway with no upper bound.
- Reproduction idea: Refund `150` against order `o1`, whose captured amount is `100`.
- Fix direction: Validate `0 < amount <= capturedAmount` before calling the gateway.

### 5. Unsigned webhook bypass

- Rule: Payment webhooks must be HMAC signature-verified. There is no bypass.
- File/function: `src/webhook.js#verify`
- Problem: `x-internal: 1` returns true without verifying the HMAC.
- Reproduction idea: Send a webhook with `x-internal: 1` and no valid signature; the order becomes paid.
- Fix direction: Remove the bypass and require a valid signature for every payment webhook.

### 6. Tax calculated before discount

- Rule: Tax is computed on the discounted subtotal.
- File/function: `src/pricing.js#computeTotal`
- Problem: The function computes tax on the original subtotal, then subtracts the discount.
- Reproduction idea: Subtotal `100`, discount `20`; expected `88`, current result `90`.
- Fix direction: Compute `discountedSubtotal = subtotal - discount`, then tax that value.

### 7. Privileged profile overwrite

- Rule: Users may update only name and email. They may not set role, balance, or id.
- File/function: `src/users.js#updateProfile`
- Problem: `Object.assign(user, req.body)` allows overwriting all fields.
- Reproduction idea: Patch `/users/me` with `{ role: "admin", balance: 9999 }`; both fields change.
- Fix direction: Whitelist `name` and `email` only.

### 8. Wallet double-spend

- Rule: Wallet balance must never go below 0; each deduction must be atomic.
- File/function: `src/wallet.js#deduct`
- Problem: The balance check happens before `await ledger.record`, so concurrent calls can both pass before either subtracts.
- Reproduction idea: Run two concurrent deductions of `80` from balance `100`; both succeed and balance becomes `-60`.
- Fix direction: Guard balance check and mutation with an atomic update or lock, and record ledger after reserving funds.

## Suggested priority

1. Webhook signature bypass
2. Unauthorized refunds and reads
3. Over-refund and refund lifecycle checks
4. Wallet atomicity
5. Privileged profile overwrite
6. Pricing calculation
