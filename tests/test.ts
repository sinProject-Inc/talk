import { expect, test } from '@playwright/test'

test('before sign in', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' })
	await expect(page).toHaveTitle('Talk')
})
