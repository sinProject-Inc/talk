---
title: GitHub Actions
---

We use [GitHub Actions](https://docs.github.com/en/actions) to perform two types of CI: Checks and tests.

## Secrets

Do not write confidential information (environment variables etc.) directly. Instead, register it in GitHub's Secrets.

```md
- GitHub > Repository > Settings
- Secrets and Variables > Actions
- New repository secret
```

If you want to use the secret, refer to it as `[SECRET_NAME]`.

```yaml:.github/workflows/ci.yml
echo DATABASE_URL=${{ secrets.DATABASE_URL }} >> .env
```

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
