import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { auth_file_path } from './lib/setup.js'

test.beforeEach(async ({ page }) => {
	await page.goto('./translate', { waitUntil: 'networkidle' })

	if (page.url().includes('/sign-in')) return

	await page.locator('#language_1').selectOption('en-US')
	await page.locator('#language_2').selectOption('ja-JP')

	await page.waitForTimeout(process.env['CI'] ? 1000 : 500)
})

test('before sign in', async ({ page }) => {
	await expect(page).toHaveTitle('Sign in - Talk')
})

test.describe('after sign in', () => {
	if (process.env['CI']) return
	test.use({ storageState: auth_file_path })

	test('has title', async ({ page }) => {
		await expect(page).toHaveTitle('Translate - Talk')
	})

	// test('clicking a text in the history moves it into the box', async ({ page }) => {
	// 	const history_text = page.locator('.text').first()
	// 	const text = await history_text.innerText()

	// 	await history_text.click()

	// 	const bottom_textarea = page.getByRole('textbox').first()

	// 	await expect(bottom_textarea).toHaveValue(text)
	// })

	async function check_main_box_heights(page: Page): Promise<void> {
		const glass_panels = page.locator('.main-box')
		const count = await glass_panels.count()

		const box_heights: Array<number> = []

		for (let i = 0; i < count; i++) {
			const glass_panel = glass_panels.nth(i)
			const box = await glass_panel.boundingBox()

			if (!box) throw new Error('box is null')

			box_heights.push(box.height)

			if (box_heights.length > 0 && box_heights[0] && typeof box_heights[0] === 'number') {
				expect(box.height).toBeCloseTo(box_heights[0], 1)
			}
		}
	}

	test('check main box heights', async ({ page }) => {
		await check_main_box_heights(page)
	})

	test('check main box heights on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 })
		await check_main_box_heights(page)
	})

	test('check if having no history hides box', async ({ page }) => {
		await clear_text(page)
		await fulfill_mock_text(page, 0)

		const history_box = page.getByTestId('history-box')

		await expect(history_box).toHaveClass(/invisible/)
	})

	test('check if having 1 text in history shows box', async ({ page }) => {
		await clear_text(page)
		await fulfill_mock_text(page, 1)

		const history_box = page.getByTestId('history-box')

		await expect(history_box).toBeVisible()
	})

	test('check if having 10 texts in history shows box', async ({ page }) => {
		await clear_text(page)
		await fulfill_mock_text(page, 10)

		const history_box = page.getByTestId('history-box')

		await expect(history_box).toBeVisible()
	})

	test('adding text should display the translation', async ({ page }) => {
		await page.waitForSelector('.text-area')

		const from_text_area = page.locator('.text-area').first()

		await from_text_area.fill('Hello')
		await from_text_area.press('Meta+Enter')

		await page.waitForTimeout(1000)

		const bottom_textarea = page.getByRole('textbox').nth(1)

		await expect(bottom_textarea).toHaveValue('こんにちは')
	})

	// test('adding text should add it to the history', async ({ page }) => {
	// 	await page.waitForSelector('.text-area')
	// 	const from_text_area = page.locator('.text-area').first()

	// 	await from_text_area.fill('Hello')
	// 	await from_text_area.press('Enter')

	// 	const first_history_text = page.locator('.text').first()

	// 	await expect(first_history_text).toHaveText('Hello')
	// })

	// Cannot use microphone
	// test('listening disables the top bar', async ({page}) => {
	// 	await page.locator('.listen-button').first().click()

	// 	await expect(page.locator('#language-1')).toBeDisabled()
	// })

	test('translate 250 characters', async ({ page }) => {
		await page.waitForSelector('.text-area')

		const from_text_area = page.locator('.text-area').first()

		const dummy_text = 'a'.repeat(250)

		await from_text_area.fill(dummy_text)
		await from_text_area.press('Meta+Enter')

		const bottom_textarea = page.getByRole('textbox').nth(1)

		await expect(bottom_textarea).toHaveValue(/[あa]/)
	})

	test('translate 251 characters', async ({ page }) => {
		await page.waitForSelector('.text-area')

		const from_text_area = page.locator('.text-area').first()

		const dummy_text = 'a'.repeat(251)

		await from_text_area.fill(dummy_text)
		await from_text_area.press('Meta+Enter')

		const bottom_textarea = page.getByRole('textbox').nth(1)

		await expect(bottom_textarea).toHaveValue('翻訳できるのは 250文字までです。')
	})

	test('having no text disables delete button', async ({ page }) => {
		await page.waitForTimeout(500)

		await page.waitForSelector('.text-area')

		const from_text_area = page.locator('.text-area').first()

		await from_text_area.fill('')
		await from_text_area.press('Meta+Enter')

		const button = page.getByTestId('delete_button').first().getByRole('button')

		await expect(button).toBeDisabled()
	})

	test('having text enables delete button', async ({ page }) => {
		await page.waitForSelector('.text-area')

		const from_text_area = page.locator('.text-area').first()

		await from_text_area.fill('Hello')
		await from_text_area.press('Enter')

		const button = page.getByTestId('delete_button').first().getByRole('button')

		await expect(button).toBeEnabled()
	})

	async function setup_text_area(page: Page, text: string): Promise<void> {
		await page.waitForSelector('.text-area')

		const from_text_area = page.locator('.text-area').first()
		await from_text_area.fill(text)
		await from_text_area.press(text ? 'Enter' : 'Meta+Enter')
	}

	async function test_button_state(
		page: Page,
		button_test_id: string,
		text: string,
		should_be_enabled: boolean
	): Promise<void> {
		await setup_text_area(page, text)

		const button = page.getByTestId(button_test_id).first().getByRole('button')

		if (should_be_enabled) {
			await expect(button).toBeEnabled()
		} else {
			await expect(button).toBeDisabled()
		}
	}

	interface Specs {
		button_test_id: string
		text: string
		should_be_enabled: boolean
	}

	const specs: Specs[] = [
		{ button_test_id: 'tts_button', text: '', should_be_enabled: false },
		{ button_test_id: 'tts_button', text: 'Hello', should_be_enabled: true },
		{ button_test_id: 'copy_button', text: '', should_be_enabled: false },
		{ button_test_id: 'copy_button', text: 'Hello', should_be_enabled: true },
	]

	specs.forEach(({ button_test_id, text, should_be_enabled }) => {
		test(`'${button_test_id}' should be ${
			should_be_enabled ? 'enabled' : 'disabled'
		} with text '${text}'`, async ({ page }) => {
			await test_button_state(page, button_test_id, text, should_be_enabled)
		})
	})

	async function clear_text(page: Page): Promise<void> {
		await page.reload()

		await page.route('/api/text/en/10', async (route) => {
			const json = {}

			await route.fulfill({ json })
		})
	}

	async function fulfill_mock_text(page: Page, limit: number): Promise<void> {
		await page.route('/api/text/en/10', async (route) => {
			if (limit === 0) await route.fulfill({ json: {} })

			const json = mock_data.slice(0, limit)

			await route.fulfill({ json })
		})
	}
})

const mock_data = [
	{
		id: 110,
		created_at: '2023-02-02T10:08:24.353Z',
		updated_at: '2023-02-03T03:45:18.769Z',
		language_id: 1,
		text: "I'm curious I'm a",
	},
	{
		id: 103,
		created_at: '2023-02-02T08:29:28.702Z',
		updated_at: '2023-02-03T03:32:23.966Z',
		language_id: 1,
		text: 'what',
	},
	{
		id: 93,
		created_at: '2023-02-02T08:22:09.521Z',
		updated_at: '2023-02-02T10:07:47.816Z',
		language_id: 1,
		text: "I'm curious I'm a curious boy",
	},
	{
		id: 95,
		created_at: '2023-02-02T08:24:58.010Z',
		updated_at: '2023-02-02T10:07:41.140Z',
		language_id: 1,
		text: 'Hello',
	},
	{
		id: 101,
		created_at: '2023-02-02T08:28:48.609Z',
		updated_at: '2023-02-02T10:05:10.247Z',
		language_id: 1,
		text: 'okay, how does this work?',
	},
	{
		id: 108,
		created_at: '2023-02-02T08:45:37.404Z',
		updated_at: '2023-02-02T09:42:03.718Z',
		language_id: 1,
		text: 'What the heck',
	},
	{
		id: 87,
		created_at: '2023-02-02T08:21:39.053Z',
		updated_at: '2023-02-02T09:42:02.716Z',
		language_id: 1,
		text: "hi what did you eat for dinner what did you for lunch today what's",
	},
	{
		id: 90,
		created_at: '2023-02-02T08:21:58.677Z',
		updated_at: '2023-02-02T09:03:27.600Z',
		language_id: 1,
		text: "I'm always there",
	},
	{
		id: 105,
		created_at: '2023-02-02T08:29:32.640Z',
		updated_at: '2023-02-02T09:03:27.460Z',
		language_id: 1,
		text: 'Japan',
	},
	{
		id: 97,
		created_at: '2023-02-02T08:26:09.715Z',
		updated_at: '2023-02-02T09:03:26.859Z',
		language_id: 1,
		text: 'what the heck!',
	},
]
