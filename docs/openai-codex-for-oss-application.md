# OpenAI Codex for Open Source Application Draft

Application link: https://openai.com/form/codex-for-oss/

Before submitting:

1. Push this repository to a public GitHub repo.
2. Set your GitHub profile visibility to public.
3. Replace the repository URL in the form with your public repo URL.
4. Get your OpenAI Organization ID from https://platform.openai.com/settings/organization/general.

## Suggested repository URL

Use the public GitHub URL after pushing, for example:

```text
https://github.com/YOUR_GITHUB_USERNAME/shoppay-audit-benchmark
```

## Describe your role

```text
Primary maintainer
```

## Why does this repository qualify? 500 characters max

```text
ShopPay Audit Benchmark is a compact OSS benchmark for evaluating whether Codex and AI coding agents can find business-logic defects that happy-path tests miss. It covers refunds, authorization, webhook trust, wallet atomicity, tax order, and profile privilege boundaries. I maintain it as a repeatable benchmark with specs, tests, CI, and seeded cases for agent audit workflows.
```

## How will you use API credits for your project? 500 characters max

```text
I will use credits to run Codex across benchmark tasks, generate and review audit reports and fixes, expand seeded business-rule scenarios, and compare agent behavior across releases. Credits would support CI-like evaluation, maintainer automation, and documentation examples for OSS users testing Codex on logic-audit workflows.
```

## Anything else we should know? 500 characters max

```text
The project is intentionally small so maintainers can quickly verify whether an agent reads the spec and reasons across code paths instead of relying on crashes, dependency scans, or happy-path tests.
```
