import { expect, test } from '@playwright/test'
import { get_pin_code_from_mail } from './lib/get_pin_code_from_mail.js'
import { sleep } from '../src/lib/general/system.js'

const host = 'http://localhost:5273'
const path = '/chat'
const url = `${host}${path}`

const auth_file_path = 'playwright/.auth/user.json'

test.beforeEach(async ({ page }) => {
	await page.goto(url)
})

test('before sign in', async ({ page }) => {
	await expect(page).toHaveTitle('Talk - Sign in')
})

test('sign in', async ({ page }) => {
	test.setTimeout(20 * 1000)

	// URL に sign-in が含まれているか
	expect(page.url()).toContain('sign-in')

	const gmail_user = process.env.GMAIL_USER ?? ''

	await page.getByPlaceholder('Enter email').fill(gmail_user)
	await page.getByRole('button', { name: 'Continue' }).click()

	expect(page.url()).toContain('pin-code')

	await sleep(1000)

	const pin_code = await get_pin_code_from_mail()

	await page.getByPlaceholder('PIN code').fill(pin_code)
	await page.getByRole('button', { name: 'Submit' }).click()

	await expect(page).toHaveTitle('Talk - Chat')

	await page.context().storageState({ path: auth_file_path })
})

test.describe('after sign in', () => {
	test.use({ storageState: auth_file_path })

	test('has title', async ({ page }) => {
		await expect(page).toHaveTitle('Talk - Chat')
	})

	test('has page title', async ({ page }) => {
		const title = page.getByRole('link', { name: 'Talk', exact: true })
		await expect(title).toBeVisible()
	})

	test('change locale', async ({ page }) => {
		await page.getByRole('combobox').selectOption('ja-JP')

		const title = page.getByRole('link', { name: 'トーク', exact: true })
		await expect(title).toBeVisible()
	})

	test('init focus', async ({ page }) => {
		const name = page.getByPlaceholder('Name')
		await expect(name).toBeFocused()
	})

	test('on enter name', async ({ page }) => {
		const name = page.getByPlaceholder('Name')

		await name.click()
		await name.press('Enter')
		await expect(name).toBeFocused()
	})

	test('on enter name after filling', async ({ page }) => {
		const name = page.getByPlaceholder('Name')

		await expect(name).toBeFocused()

		await name.fill('aaaaa')
		await name.press('Enter')

		const text = page.locator('.outline-none')

		await expect(text).toBeFocused()
	})

	test('send message', async ({ page }) => {
		const name = page.getByPlaceholder('Name')
		const text = page.locator('.outline-none')

		await expect(name).toBeFocused()

		await name.fill('playwright test')
		await name.press('Enter')

		await expect(text).toBeFocused()

		await text.fill('Hello World!')
		await text.press('Enter')

		const chat_name = page.getByTestId('chat_name').last()
		const chat_message = page.getByTestId('chat_message').last()

		await expect(chat_name).toHaveText('playwright test')
		await expect(chat_message).toHaveText('Hello World!')
	})
})
