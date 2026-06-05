# Codex Reference Audit Run

## Run metadata

- Date: 2026-06-05
- Tool/model: Codex reference audit run
- Repository: https://github.com/Dmatut7/shoppay-audit-benchmark
- Target commit: `4d48579364459bb7b8413064e89131b2e8b5f13a`
- Prompt:

```text
Read SPEC.md, audit src/, and report every implementation behavior that violates the business rules. For each finding, include the violated rule, impacted file/function, reproduction idea, and minimal fix direction. Do not rely only on existing tests.
```

## Raw audit report

### Summary

The implementation violates multiple written business rules in `SPEC.md`. The highest-impact issues are unsigned webhook payment approval, unauthorized order access/refunds, over-refund behavior, and wallet double-spend. The code passes the baseline test suite because the default branch intentionally preserves flawed behavior for benchmark reproducibility.

### Finding 1: Cross-user order reads

- Violated rule: A user may read only their own orders. Admins may act on any order.
- File/function: `src/orders.js#getOrder`
- Why it violates the rule: The function loads `orders[req.params.id]` and returns it without checking `req.user`, ownership, or admin status.
- Reproduction idea: Call `getOrder` as user `u1` with `params.id = "o2"`; the function returns order `o2`, which belongs to `u2`.
- Minimal fix direction: Import `isAdmin`; return 403 unless `order.userId === req.user.id` or `isAdmin(req.user)`.

### Finding 2: Cross-user refunds

- Violated rule: A user may refund only their own orders. Admins may act on any order.
- File/function: `src/orders.js#refund`
- Why it violates the rule: The function refunds any existing order by ID and never checks whether `req.user` owns the order.
- Reproduction idea: Call `refund` as user `u2` for order `o1`; the refund succeeds even though `o1` belongs to `u1`.
- Minimal fix direction: Add the same ownership/admin authorization guard before calling `gateway.refund`.

### Finding 3: Pending orders can be refunded

- Violated rule: An order may be refunded only when `status === "paid"`.
- File/function: `src/orders.js#refund`
- Why it violates the rule: The function does not inspect `order.status` and calls the gateway for pending, cancelled, or already refunded orders.
- Reproduction idea: Call `refund` for `o2`, which starts as `pending`; the function returns status 200.
- Minimal fix direction: Return a 409 or 400 for any order whose status is not `paid`.

### Finding 4: Refund amount can exceed captured amount

- Violated rule: A refund amount must not exceed the order's `capturedAmount`.
- File/function: `src/orders.js#refund`
- Why it violates the rule: `req.body.amount` is passed directly to `gateway.refund` without checking bounds.
- Reproduction idea: Call `refund` for `o1` with amount `150`; `capturedAmount` is only `100`, but the refund succeeds.
- Minimal fix direction: Validate `amount > 0` and `amount <= order.capturedAmount` before gateway interaction.

### Finding 5: Payment webhook signature bypass

- Violated rule: Payment webhooks must be HMAC signature-verified before being trusted. There is no bypass.
- File/function: `src/webhook.js#verify`
- Why it violates the rule: `x-internal: 1` returns `true` before HMAC verification.
- Reproduction idea: Send a webhook with `headers["x-internal"] = "1"`, no valid signature, and `body.orderId = "o2"`; `o2` becomes paid.
- Minimal fix direction: Remove the internal shortcut and require HMAC verification for every webhook.

### Finding 6: Webhook can mark an order paid without a verified payment binding

- Violated rule: An order becomes paid only via a signature-verified payment webhook.
- File/function: `src/webhook.js#handlePaymentWebhook`
- Why it violates the rule: Because `verify` can be bypassed, `handlePaymentWebhook` trusts an unsigned body and sets `order.status = "paid"`.
- Reproduction idea: Use the unsigned internal webhook bypass to mark pending order `o2` as paid.
- Minimal fix direction: Require a valid signature and bind the event to a valid payment ID before mutating order status.

### Finding 7: Tax is calculated before discount

- Violated rule: Tax is computed on the discounted subtotal.
- File/function: `src/pricing.js#computeTotal`
- Why it violates the rule: The function computes `tax = subtotal * TAX_RATE`, then subtracts the discount.
- Reproduction idea: Items total `100`, coupon amount `20`; expected total is `(100 - 20) * 1.1 = 88`, current result is `90`.
- Minimal fix direction: Compute `discountedSubtotal = subtotal - discount`; calculate tax from `discountedSubtotal`.

### Finding 8: Users can overwrite privileged profile fields

- Violated rule: Users may update only their own non-privileged profile fields; they may not set `role`, `balance`, or `id`.
- File/function: `src/users.js#updateProfile`
- Why it violates the rule: `Object.assign(user, req.body)` copies every request body field onto the stored user object.
- Reproduction idea: Call `updateProfile` as `u1` with `{ id: "u2", role: "admin", balance: 9999 }`; all privileged fields change.
- Minimal fix direction: Whitelist only `name` and `email`; ignore or reject all privileged fields.

### Finding 9: Wallet deduction can double-spend under concurrency

- Violated rule: Wallet balance must never go below zero; each deduction must be atomic.
- File/function: `src/wallet.js#deduct`
- Why it violates the rule: Balance is checked before `await ledger.record`; concurrent calls can both pass the check before either subtracts funds.
- Reproduction idea: Run two concurrent `deduct("u1", 80)` calls against balance `100`; both succeed and the final balance becomes `-60`.
- Minimal fix direction: Make balance check and mutation atomic, for example by locking per user or using a compare-and-swap update before the awaited ledger call.

## Prioritized fix plan

1. Remove webhook signature bypass and bind payment events to verified payment IDs.
2. Add ownership/admin checks to order reads and refunds.
3. Enforce refund status and amount limits.
4. Make wallet deductions atomic.
5. Whitelist profile update fields.
6. Correct tax-after-discount calculation.
