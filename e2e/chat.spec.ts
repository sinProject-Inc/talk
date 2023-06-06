import { Page, expect, test } from '@playwright/test'
import { auth_file_path } from './lib/setup.js'

test.beforeEach(async ({ page }) => {
	await page.goto('./chat', { waitUntil: 'networkidle' })
})

test('before sign in', async ({ page }) => {
	await expect(page).toHaveTitle('Sign in - Talk')
})

test.describe('after sign in', () => {
	test.use({ storageState: auth_file_path })

	test('has title', async ({ page }) => {
		await expect(page).toHaveTitle('Chat - Talk')
	})

	test('has page title', async ({ page }) => {
		const title = page.getByRole('link', { name: 'Talk', exact: true })
		await expect(title).toBeVisible()
	})

	// TODO: Fix this test
	// test('change locale', async ({ page }) => {
	// 	await page.getByRole('combobox').selectOption('ja-JP')

	// 	const title = page.getByRole('link', { name: 'トーク', exact: true })
	// 	await expect(title).toBeVisible()
	// })

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

	test('default room is lobby', async ({ page }) => {
		const room_id_div = page.getByTestId('room-id')

		await expect(room_id_div).toHaveText('lobby')
	})

	test('new room button generates a room and navigates', async ({ page }) => {
		await page.waitForLoadState('networkidle')
		await page.waitForTimeout(500)

		const new_room_button = page.getByTestId('new-room-button')
		await new_room_button.click()

		await page.waitForLoadState('networkidle')
		await page.waitForTimeout(500)

		const room_id_div = page.getByTestId('room-id')
		const room_id = await room_id_div.innerText()

		await expect(room_id).not.toContain('lobby')
		await expect(page).toHaveURL(`./chat/${room_id}`)
	})

	async function test_send(page: Page, input: string, output: string): Promise<boolean> {
		const name = page.getByPlaceholder('Name')
		const text = page.locator('.outline-none')

		await expect(name).toBeFocused()

		await name.fill('playwright test')
		await name.press('Enter')

		await expect(text).toBeFocused()

		await text.fill(input)
		await text.press('Enter')

		const chat_name = page.getByTestId('chat_name').last()
		const chat_message = page.getByTestId('chat_message').last()

		await expect(chat_name).toHaveText('playwright test')
		await expect(chat_message).toHaveText(output)

		return true
	}

	test('send message', async ({ page }) => {
		const input = 'Hello World!'
		const output = 'Hello World!'
		await test_send(page, input, output)
	})

	test('trim message', async ({ page }) => {
		const input = '\nHello World!\n'
		const output = 'Hello World!'
		await test_send(page, input, output)
	})

	test('indent message', async ({ page }) => {
		const input = 'Hello World!\nHello World!'
		const output = 'Hello World!\nHello World!'
		await test_send(page, input, output)
	})

	test('excess indentions', async ({ page }) => {
		const input = 'Hello World!\n\n\n\nHello World!'
		const output = 'Hello World!\n\nHello World!'
		await test_send(page, input, output)
	})
})
