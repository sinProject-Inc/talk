import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.goto('./', { waitUntil: 'networkidle' })
})

test('before sign in', async ({ page }) => {
	await expect(page).toHaveTitle('Talk')
})
