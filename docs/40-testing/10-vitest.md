---
title: Vitest
---

How we automate our tests using [Vitest](https://vitest.dev/).

Vitest is a testing framework designed for unit testing.

## File Name

In the same directory as the file of the code to be tested is in, write test code in a file named [filename of the code to be tested].test.ts.

## Options

Change the files to be included in the test run.

```ts
// vite.config.ts
export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		hookTimeout: 3000,
		teardownTimeout: 0,
	},
})
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/vite.config.ts)

## Scripts

We have prepared the following scripts to execute Vitest.

```json
// package.json
{
	"scripts": {
		"test": "vitest",
		"coverage": "vitest run --coverage",
		"test:run": "vitest run",
		"test:ci": "CI=true npm run test"
	}
}
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/package.json)

## VSCode Extension

Use the [VSCode Extension](./vscode-extensions#testing) for testing.

## Sample Code

```ts
// src/lib/genera/valid_id.test.ts
import { expect, test } from 'vitest'
import { ValidId } from './valid_id'

test('1', () => {
	expect(new ValidId(1).id).toEqual(1)
})
```

When checking thrown errors:

```ts
// src/lib/genera/valid_id.test.ts
import { expect, test } from 'vitest'
import { ValidId } from './valid_id'

test('NaN', () => {
	expect(() => new ValidId(NaN)).toThrow('id is not number')
})
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/src/lib/general/valid_id.test.ts)
