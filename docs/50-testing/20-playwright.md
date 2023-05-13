---
title: Playwright
---

How we automate our tests using [Playwright](https://playwright.dev/).

Playwright is an E2E (end-to-end) testing framework.

## File Name

Create an e2e directory, and name the files as \*.spec.ts.

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
	retries: 0,
	workers: undefined,
	reporter: [['html', { open: 'never' }]],
	use: {
		video: 'retain-on-failure',
	},
}
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/playwright.config.ts)

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

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/playwright.config.ts)

### Web Server

To perform tests quickly, use a development server. Also, change the baseURL.

```ts
	webServer: [
		{
			command: 'npm run dev',
			url: 'http://127.0.0.1:5173/talk/',
			reuseExistingServer: !process.env.CI,
		},
		// {
		// 	command: 'npm run build && npm run preview',
		// 	port: 4173,
		// 	reuseExistingServer: !process.env.CI,
		// },
	],
	use: {
			url: 'http://127.0.0.1:5173/talk/',
	}
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/playwright.config.ts)

[More information >](https://playwright.dev/docs/test-webserver#adding-a-baseurl)

### Setup

Specify processes to be executed beforehand, such as logging in. Add dependencies to the browser settings.

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

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/playwright.config.ts)

## Scripts

We have prepared the following scripts to execute Vitest.

```json
// package.json
{
	"scripts": {
		"test:e2e": "playwright test",
		"test:ci": "CI=true npm run test"
	}
}
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/package.json)

## VSCode Extension

Use [VSCode Extension](./vscode-extensions#testing) for testing through VSCode.

## Locate by test id

To make it easier to identify an Element from Playwright, "data-testid" can be used.

```html
// src/routes/docs/[slug]/+page.svelte

<a data-testid="next-page">Next Page</a>
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/src/routes/docs/[slug]/+page.svelte)

```ts
// e2e/docs.spec.ts
await page.getByTestId('next-page').click()
```

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/e2e/docs.spec.ts)

[More Information >](https://playwright.dev/docs/locators#locate-by-test-id)

## Sample Code

```ts
// e2e/chat.spec.ts
import { Page, expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.goto('./chat', { waitUntil: 'networkidle' })
})

test('before sign in', async ({ page }) => {
	await expect(page).toHaveTitle('Talk - Sign in')
})
```

In cases where common setup is needed, such as for login processes:

```ts
// e2e/chat.spec.ts
import { Page, expect, test } from '@playwright/test'
import { auth_file_path } from './lib/setup.js'

test.beforeEach(async ({ page }) => {
	await page.goto('./chat', { waitUntil: 'networkidle' })
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

[View this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/e2e/chat.spec.ts)
