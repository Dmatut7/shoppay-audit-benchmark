# ShopPay — business rules (the spec / source of truth)

## Money
- A refund amount MUST NOT exceed the order's `capturedAmount`.
- Tax (10%) is computed on the **discounted** subtotal (apply discount first, then tax).

## Orders & lifecycle
- An order may be refunded ONLY when `status === "paid"`.
- Refunding a `pending`, `cancelled`, or already `refunded` order is forbidden.
- An order becomes `paid` ONLY via a **signature-verified** payment webhook.

## Authorization
- A user may read or refund ONLY their own orders. Admins may act on any order.
- Only admins may change another user's `role` or `balance`.
- A user may update only their own non-privileged profile fields (name, email). They may NOT set `role`, `balance`, or `id`.

## Wallet
- A wallet `balance` MUST never go below 0.
- Each deduction MUST be atomic — concurrent requests must not double-spend.

## Webhooks
- Payment webhooks MUST be HMAC signature-verified before being trusted. There is no bypass.
