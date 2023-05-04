---
title: Vitest
---

We are automating our tests using [Vitest](https://vitest.dev/).

Vitest is a testing framework designed for unit testing.

## File Name

In the same directory as the code to be tested, write the test code in a file named [filename of the code to be tested].test.ts.

## Sample Code

```ts
// src/lib/genera/valid_id.test.ts
import { expect, test } from 'vitest'
import { ValidId } from './valid_id'

test('1', () => {
	expect(new ValidId(1).id).toEqual(1)
})
```

In the case of checking errors that are thrown:

```ts
// src/lib/genera/valid_id.test.ts
import { expect, test } from 'vitest'
import { ValidId } from './valid_id'

test('NaN', () => {
	expect(() => new ValidId(NaN)).toThrow('id is not number')
})
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/src/lib/general/valid_id.test.ts)

## Scripts

We have prepared three scripts to execute Vitest.

```json
// package.json
{
	"scripts": {
		"test": "vitest",
		"coverage": "vitest run --coverage",
		"test:run": "vitest run"
	}
}
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/package.json)

## Options

Change the files to be included in the test run.

```ts
// vite.config.ts
export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
	},
})
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/vite.config.ts)

## VSCode Extension

Use the [VSCode Extension](./vscode-extensions#testing) for testing.
