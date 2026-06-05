# Scoring Guide

This guide defines how to score an AI agent audit run against ShopPay Audit Benchmark.

The benchmark rewards business-rule reasoning. A high score requires connecting implementation behavior back to `SPEC.md`, not just listing suspicious code.

## Audit task

Give the agent this prompt:

```text
Read SPEC.md, audit src/, and report every implementation behavior that violates the business rules. For each finding, include the violated rule, impacted file/function, reproduction idea, and minimal fix direction. Do not rely only on existing tests.
```

## Scoring rubric

Maximum score: 100 points.

| Area | Points | What earns credit |
| --- | ---: | --- |
| Spec grounding | 15 | Findings cite the exact `SPEC.md` rule or clearly paraphrase it. |
| Defect coverage | 40 | Finds seeded issues across refunds, authorization, webhook trust, pricing, profile updates, and wallet concurrency. |
| Business impact | 15 | Explains the user/product impact, such as unauthorized refund, over-refund, or double-spend. |
| Reproduction quality | 15 | Gives a concrete test, request, or call sequence that would expose the issue. |
| Fix direction | 10 | Proposes small, rule-aligned fixes without unrelated rewrites. |
| Prioritization | 5 | Ranks high-risk issues ahead of lower-impact cleanup. |

## Seeded defect checklist

A strong audit should identify these categories:

1. `src/orders.js#getOrder` lacks ownership/admin checks.
2. `src/orders.js#refund` lacks ownership/admin checks.
3. `src/orders.js#refund` allows refunding non-paid orders.
4. `src/orders.js#refund` allows refund amounts above `capturedAmount`.
5. `src/webhook.js#verify` allows `x-internal: 1` to bypass HMAC verification.
6. `src/webhook.js#handlePaymentWebhook` trusts the bypass and marks orders paid.
7. `src/pricing.js#computeTotal` calculates tax before discount.
8. `src/users.js#updateProfile` allows privileged field overwrite.
9. `src/wallet.js#deduct` can double-spend under concurrent deductions.

## Score bands

- 90-100: Production-quality business audit. Finds nearly all seeded defects and explains fixes clearly.
- 70-89: Useful audit. Finds most high-impact issues but may miss one domain or omit some reproductions.
- 40-69: Partial audit. Finds obvious issues but weak cross-domain reasoning.
- 0-39: Mostly syntax/security-scan style output. Does not reliably map code behavior to business rules.

## Notes for maintainers

When comparing agents, keep the prompt and repository commit fixed. Record:

- model/tool name
- commit SHA
- prompt used
- raw report
- score and rationale

This makes future benchmark runs comparable.

## Reference run

See `examples/runs/2026-06-05-codex-reference-audit.md` and `examples/runs/2026-06-05-codex-reference-scorecard.json` for a complete scored example.
