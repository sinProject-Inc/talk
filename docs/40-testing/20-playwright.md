---
title: Playwright
---

How we automate our tests using [Playwright](https://playwright.dev/).

Playwright is an E2E (end-to-end) testing framework.

## Installation

```console
$ npm init playwright@latest

Getting started with writing end-to-end tests with Playwright:
Initializing project in '.'
✔ Where to put your end-to-end tests? · e2e
✔ Add a GitHub Actions workflow? (y/N) · N
✔ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · Y
```

## File Name

Create an e2e directory, and name the files as \*.spec.ts.

## Configuration

### Basic changes

Change the test directory, timeout duration, and other settings as needed.

Configure the reporter not to open automatically, and output a video when an error occurs.

```ts:playwright.config.ts
const config: PlaywrightTestConfig = {
	testDir: './e2e',
	timeout: process.env.CI ? 20 * 1000 : 5 * 1000,
	expect: {
		timeout: 2000,
	},
	retries: 0,
	workers: undefined,
	reporter: [['html', { open: 'never' }]],
	use: {
		video: 'retain-on-failure',
		contextOptions: {
			permissions: ['clipboard-read', 'clipboard-write', 'accessibility-events'],
		},
	},
}
```

[Playwright - TestConfig >](https://playwright.dev/docs/api/class-testconfig)

### Target Browsers

Ensure that tests are not run on browsers where testing is not necessary.

```ts:playwright.config.ts
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

### Web Server

To perform tests quickly, use a development server. Also, change the baseURL.

```ts:playwright.config.ts
const base = ''
// const base = '/talk'
const config: PlaywrightTestConfig = {
	webServer: [
		{
			command: 'npm run dev',
			url: `http://127.0.0.1:5173${base}/`,
			reuseExistingServer: !process.env.CI,
		},
		// {
		// 	command: 'npm run build && npm run preview',
		// 	port: 4173,
		// 	reuseExistingServer: !process.env.CI,
		// },
	],
	use: {
		baseURL: `http://127.0.0.1:5173${base}/`,
	}
}
```

[More information >](https://playwright.dev/docs/test-webserver#adding-a-baseurl)

### Setup

Specify processes to be executed beforehand, such as logging in. Add dependencies to the browser settings.

```ts:playwright.config.ts
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

## Scripts

We have prepared the following scripts to execute Vitest.

```json:package.json
{
	"scripts": {
		"test:e2e": "playwright test",
		"test:e2e:ci": "CI=true npm run test:e2e"
	}
}
```

## VSCode Extension

Use [VSCode Extension](./vscode-extensions#testing) for testing through VSCode.

## Running tests

- Running all tests

```bash
npx playwright test
```

- Running a single test file

```bash
npx playwright test <filename>
```

[More Info >](https://playwright.dev/docs/running-tests)

## Running Codegen

Use the codegen command to run the test generator followed by the URL of the website you want to generate tests for. The URL is optional and you can always run the command without it and then add the URL directly into the browser window instead.

```bash
npx playwright codegen localhost:5173
```

[More Info >](https://playwright.dev/docs/codegen-intro)

## Reporters

A quick way of opening the last test run report is:

```bash
npx playwright show-report
```

[More Info >](https://playwright.dev/docs/test-reporters#html-reporter)

## Locate by test id

To make it easier to identify an Element from Playwright, "data-testid" can be used.

```html:src/routes/docs/[slug]/+page.svelte
<a data-testid="next-page">Next Page</a>
```

```ts:e2e/docs.spec.ts
await page.getByTestId('next-page').click()
```

[More Information >](https://playwright.dev/docs/locators#locate-by-test-id)

## Sample Code

```ts:e2e/chat.spec.ts
import { Page, expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.goto('./chat', { waitUntil: 'networkidle' })
})

test('before sign in', async ({ page }) => {
	await expect(page).toHaveTitle('Talk - Sign in')
})
```

In cases where common setup is needed, such as for login processes:

```ts:e2e/chat.spec.ts
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
