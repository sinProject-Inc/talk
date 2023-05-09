---
title: Git Hooks
---

We use Husky for our Git Hooks.

- [Husky](https://typicode.github.io/husky/#/) - Husky improves your commits and more 🐶 woof!

## pre-commit

Combine [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), and [lint-staged](https://github.com/okonet/lint-staged) to format code.

```bash
# ./husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged

npm run lint
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.husky/pre-commit)

```json
// package.json
{
	"scripts": {
		"lint": "prettier --plugin-search-dir . --check . && eslint ."
	},
	"lint-staged": {
		"*.{js,ts,svelte}": "eslint --cache --fix",
		"*.css": "stylelint --fix",
		"*.{js,css,md,ts,svelte,css,scss,json}": "prettier --write"
	}
}
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/package.json)

## pre-push

Perform TypeScript type checking, run tests with [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/), and finally check for conflicts.

```bash
# ./husky/pre-push
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run typecheck
npm run check

npm run test:run
npm run test:e2e

npm run build

git fetch origin
git merge --no-commit --no-ff origin/main
git reset --hard HEAD
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.husky/pre-push)

```json
// package.json
{
	"scripts": {
		"test:run": "vitest run",
		"test:e2e": "playwright test",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"typecheck": "tsc --noEmit"
	}
}
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/package.json)
