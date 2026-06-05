# Contributing

ShopPay Audit Benchmark welcomes small, focused contributions that improve the benchmark as an AI business-logic audit target.

Good contributions include:

- new business-rule scenarios with a clear spec entry
- small intentionally flawed implementations for those scenarios
- baseline tests that keep the flawed state reproducible
- fix-branch examples that demonstrate the expected regression tests
- documentation that helps maintainers evaluate Codex or other AI coding agents

## Local validation

```bash
npm test
```

The default branch intentionally contains flawed behavior. Baseline tests should pass against that flawed behavior so benchmark runs stay reproducible.

## Adding a new benchmark case

1. Add or update the business rule in `SPEC.md`.
2. Add the flawed implementation in `src/`.
3. Add baseline tests under `test/` that prove the seeded behavior exists.
4. Update `BENCHMARK.md` with the expected finding category.
5. Run `npm test`.

Keep cases compact. The goal is to test business reasoning, not framework setup.
