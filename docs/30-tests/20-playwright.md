---
title: Playwright
---

We are automating our tests using [Playwright](https://playwright.dev/).

Playwright is an E2E (end-to-end) testing framework.

## File Name

Create an e2e directory, and name the files as \*.spec.ts.

## Sample Code

```ts
// e2e/chat.spec.ts
import { Page, expect, test } from '@playwright/test'

const url = `${host}/chat`

test.beforeEach(async ({ page }) => {
	await page.goto(url)
})

test('before sign in', async ({ page }) => {
	await expect(page).toHaveTitle('Talk - Sign in')
})
```

In cases where common setup is needed, such as for login processes:

```ts
// e2e/chat.spec.ts
import { Page, expect, test } from '@playwright/test'
import { auth_file_path, host } from './lib/setup.js'

const url = `${host}/chat`

test.beforeEach(async ({ page }) => {
	await page.goto(url)
})

test.describe('after sign in', () => {
	test.use({ storageState: auth_file_path })

	test('has title', async ({ page }) => {
		await expect(page).toHaveTitle('Talk - Chat')
	})

	test('init focus', async ({ page }) => {
		const name = page.getByPlaceholder('Name')
		await expect(name).toBeFocused()
	})
})
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/e2e/chat.spec.ts)

## Configuration

### Basic changes

Change the test directory, timeout duration, and other settings as needed.

Configure the reporter not to open automatically, and output a video when an error occurs.

```ts
// playwright.config.ts
const config: PlaywrightTestConfig = {
	testDir: './e2e',
	timeout: 5 * 1000,
	expect: {
		timeout: 2000,
	},
	retries: process.env.CI ? 1 : 0,
	reporter: [['html', { open: 'never' }]],
	use: {
		video: 'retain-on-failure',
	},
}
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/playwright.config.ts)

### Target Browsers

Ensure that tests are not run on browsers where testing is not necessary.

```ts
// playwright.config.ts
const config: PlaywrightTestConfig = {
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},

		// {
		//   name: 'firefox',
		//   use: {
		//     ...devices['Desktop Firefox'],
		//   },
		// },

		// ...
	}
}
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/playwright.config.ts)

### Setup

Specify processes to be executed beforehand, such as login procedures. Add dependencies to the browser settings.

```ts
// playwright.config.ts
const config: PlaywrightTestConfig = {
	projects: [
		{ name: 'setup', testMatch: /.*\.setup\.ts/ },

		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
			dependencies: ['setup'],
		},
	}
}
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/playwright.config.ts)

## Scripts

We have prepared three scripts to execute Vitest.

```json
// package.json
{
	"scripts": {
		"test:e2e": "playwright test",
		"test:ci": "CI=true npm run test"
	}
}
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/package.json)

## VSCode Extension

Use the [VSCode Extension](./vscode-extensions#testing) for testing.
