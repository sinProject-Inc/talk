---
title: GitHub Actions
---

We use GitHub Actions to perform two types of CI: Checks and tests.

## Checks

Run a lint check, a type check, and Svelte check.

```yaml:.github/workflows/ci.yml
jobs:
  check:
    name: Check
    runs-on: ubuntu-latest
    steps:
      - name: Lint Check
        run: npm run lint

      - name: Type Check
        run: npm run typecheck

      - name: Svelte Check
        run: npm run check
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.github/workflows/ci.yml)

## Tests

Execute tests using Vitest and Playwright.

```yaml:.github/workflows/ci.yml
jobs:
  tests:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - name: Vitest Test
        run: npm run test:ci

      - name: Playwright Test
        run: npm run test:e2e
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.github/workflows/ci.yml)

## Output

Output Playwright Report and logs.

```yaml:.github/workflows/ci.yml
jobs:
  tests:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: logs
          path: logs/
          retention-days: 30
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.github/workflows/ci.yml)
