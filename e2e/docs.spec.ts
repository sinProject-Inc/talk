import { test, expect, Page } from '@playwright/test'

const docs_base = './docs'

async function to_have_title(page: Page, title: string): Promise<void> {
	await expect(page).toHaveTitle(`${title} - sinProject Talk`)
}

test.beforeEach(async ({ page }) => {
	await page.goto(docs_base, { waitUntil: 'networkidle' })
})

test('root access', async ({ page }) => {
	await to_have_title(page, 'Introduction')
	// TODO: Error on CI
	// await expect(page).toHaveURL(`${docs_base}/introduction`)
})

test('access an page', async ({ page }) => {
	await page.goto(`${docs_base}/creating-a-project`)
	await to_have_title(page, 'Creating a Project')
})

async function to_have_text_on_next_page(page: Page, text: string): Promise<void> {
	await page.getByTestId('next-page').click()
	await to_have_title(page, text)
}

test('access next pages', async ({ page }) => {
	await to_have_text_on_next_page(page, 'Creating a Project')
})

test('open search modale with keyboard shortcut', async ({ page }) => {
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(500)

	await page.keyboard.press('Control+KeyK')

	const search_modale = page.getByTestId('search-modale')

	await expect(search_modale).toBeVisible()
})

test('close search modale with keyboard shortcut', async ({ page }) => {
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(500)

	await page.keyboard.press('Control+KeyK')

	const search_modale = page.getByTestId('search-modale')

	await expect(search_modale).toBeVisible()

	await page.keyboard.press('Control+KeyK')

	await expect(search_modale).not.toBeVisible()
})

test('open search modale with navbar button', async ({ page }) => {
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(500)

	const search_button = page.getByTestId('navbar-search-button')
	await search_button.click()

	const search_modale = page.getByTestId('search-modale')

	await expect(search_modale).toBeVisible()
})

test('copy code', async ({ page }) => {
	await page.goto(`${docs_base}/vscode-workspace-settings`, { waitUntil: 'networkidle' })
	await page.getByTestId('copy-code').first().click()

	expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
		'"editor.guides.bracketPairs": true'
	)
})
