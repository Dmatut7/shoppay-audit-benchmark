# Promotion Kit

Use these short posts to share ShopPay Audit Benchmark with developers, maintainers, and AI-agent builders.

Repository: https://github.com/Dmatut7/shoppay-audit-benchmark
Landing page: https://dmatut7.github.io/shoppay-audit-benchmark/
Release: https://github.com/Dmatut7/shoppay-audit-benchmark/releases/tag/v0.1.1
Public gist: https://gist.github.com/Dmatut7/86f7966ac763ab1928747f33b30f43d9

## Short post

I built ShopPay Audit Benchmark: a tiny OSS benchmark for testing whether AI coding agents can find business-logic bugs that happy-path tests miss.

It includes written product rules, intentionally flawed code, baseline tests, an answer key, and a 100-point scoring rubric.

https://github.com/Dmatut7/shoppay-audit-benchmark

## X / Twitter

Can your AI coding agent find business-logic bugs, not just syntax/test failures?

I built ShopPay Audit Benchmark: a tiny OSS target with product rules, flawed payment/wallet code, baseline tests, an answer key, and a scoring rubric.

https://github.com/Dmatut7/shoppay-audit-benchmark

## Hacker News / Reddit title

Show HN: ShopPay Audit Benchmark — test whether AI agents find business-logic bugs

## Hacker News / Reddit body

I built a small open-source benchmark for evaluating whether AI coding agents can do business-logic audits.

The repo contains:

- `SPEC.md` as the product-rule source of truth
- intentionally flawed payment/wallet/order code
- baseline tests that document seeded defects
- a maintainer answer key
- a 100-point scoring rubric
- an example audit report

The goal is to test whether an agent maps implementation behavior back to written business intent instead of only finding syntax errors or happy-path test failures.

Repo: https://github.com/Dmatut7/shoppay-audit-benchmark

## LinkedIn

I published ShopPay Audit Benchmark, a compact open-source benchmark for testing business-logic audit quality in AI coding agents.

Most coding evaluations focus on whether an agent can make tests pass. This project asks a different question: can the agent read product rules, inspect implementation behavior, and find defects that happy-path tests miss?

The initial release covers refunds, authorization, webhook trust, wallet atomicity, pricing, and profile privilege boundaries.

Repo: https://github.com/Dmatut7/shoppay-audit-benchmark

## Dev.to / blog intro

AI coding agents are getting better at editing code, but many real product failures are not syntax errors. They are business-logic mismatches: refunding the wrong order, trusting an unsigned webhook, calculating tax in the wrong order, or double-spending a wallet balance.

ShopPay Audit Benchmark is a small open-source benchmark for testing whether agents can catch those defects from written rules.
