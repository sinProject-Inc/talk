---
title: Vitest
---

How we automate our tests using [Vitest](https://vitest.dev/).

Vitest is a testing framework designed for unit testing.

## Installation

```bash
npm install -D vitest
```

## File Name

In the same directory as the file of the code to be tested is in, write test code in a file named [filename of the code to be tested].test.ts.

## Options

Change the files to be included in the test run.

```ts:vite.config.ts
export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		hookTimeout: 3000,
		teardownTimeout: 0,
	},
})
```

## Scripts

We have prepared the following scripts to execute Vitest.

```json:package.json
{
	"scripts": {
		"test": "vitest",
		"coverage": "vitest run --coverage",
		"test:run": "vitest run",
		"test:ci": "CI=true npm run test"
	}
}
```

## VSCode Extension

Use the [VSCode Extension](./vscode-extensions#testing) for testing.

## Sample Code

```ts:src/lib/genera/valid_id.test.ts
import { expect, test } from 'vitest'
import { ValidId } from './valid_id'

test('1', () => {
	expect(new ValidId(1).id).toEqual(1)
})
```

When checking thrown errors:

```ts:src/lib/genera/valid_id.test.ts
import { expect, test } from 'vitest'
import { ValidId } from './valid_id'

test('NaN', () => {
	expect(() => new ValidId(NaN)).toThrow('id is not number')
})
```

## In-source testing

```ts:src/lib/locale/i18n.ts
if (import.meta.vitest) {
	const { test, expect } = import.meta.vitest

	test('get_initial_app_locale_code', () => {
		expect(get_initial_locale_code()).toBe('en-US')
	})
}
```

```ts:vite.config.ts
export default defineConfig({
	define: {
		'import.meta.vitest': 'undefined',
	},
})
```

```json:tsconfig.json
{
	"compilerOptions": {
		"types": ["vitest/importMeta"]
	}
}
```

[Here is the official documentation >](https://vitest.dev/guide/in-source.html)
