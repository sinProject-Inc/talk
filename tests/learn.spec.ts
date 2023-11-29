import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { auth_file_path } from './lib/setup.js'

async function run_test(page: Page, title: string): Promise<void> {
	await expect(page).toHaveTitle(title)
}

test.beforeEach(async ({ page }) => {
	await page.goto('./learn', { waitUntil: 'networkidle' })
})

test('before sign in', async ({ page }) => {
	await run_test(page, 'Sign in - Talk')
})

test.describe('after sign in', () => {
	if (process.env['CI']) return
	test.use({ storageState: auth_file_path })

	test('has title', async ({ page }) => {
		await run_test(page, 'Learn - Talk')
	})

	// test('sign in button', async ({ page }) => {
	// 	await page.getByRole('button', { name: 'Sign in' }).click()
	// 	await expect(page).toHaveURL(/sign-in/)
	// })

	test('from locale combo box', async ({ page }) => {
		await check_combo_box_value(page, 0, 'en-US')
	})

	test('to locale combo box', async ({ page }) => {
		await check_combo_box_value(page, 1, 'ja-JP')
	})

	async function check_combo_box_value(
		page: Page,
		combo_box_index: number,
		expected_value: string
	): Promise<void> {
		const combo_box = page.getByRole('combobox').nth(combo_box_index)
		await expect(combo_box).toHaveValue(expected_value)
	}

	test.describe('after sign in', () => {
		test.use({ storageState: auth_file_path })

		test('changing locale, and then moving pages keeps saved locale', async ({ page }) => {
			await page.getByRole('combobox').first().selectOption('yue-HK')
			await page.getByRole('combobox').last().selectOption('km-KH')

			page.waitForTimeout(500)

			await page.goto('./translate', { waitUntil: 'networkidle' })

			await expect(page.getByRole('combobox').first()).toHaveValue('km-KH')
			await expect(page.getByRole('combobox').last()).toHaveValue('yue-HK')
		})

		// if (!process.env.CI) {
		// 	test('change locale', async ({ page }) => {
		// 		const locale_combobox = page.getByTestId('from-locale-select')
		// 		await locale_combobox.selectOption('ja-JP')
		// 		await expect(page.locator('.nav-item-text').first()).toHaveText('学ぶ')

		// 		await page.goto('/', { waitUntil: 'networkidle' })
		// 		await expect(page.locator('.nav-item-text').first()).toHaveText('学ぶ')

		// 		await page.goto('./learn', { waitUntil: 'networkidle' })
		// 		const locale_combobox2 = page.getByTestId('from-locale-select')
		// 		await locale_combobox2.selectOption('en-US')
		// 	})
		// }
	})

	// test('If there is text on translate, there is text on main', async ({ page }) => {
	// 	await page.waitForSelector('.text')
	// 	const main_text_count = await page.locator('.text').count()

	// 	await page.goto('/translate')
	// 	await page.waitForSelector('.text')
	// 	const translate_page_count = await page.locator('.text').count()

	// 	await expect(main_text_count).toBeGreaterThanOrEqual(translate_page_count)
	// })
})
