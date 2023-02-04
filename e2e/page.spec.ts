import { test, expect } from '@playwright/test'

const host = 'http://localhost:5173'
const path = '/'

const url = host + path

test.beforeEach(async ({ page }) => {
	await page.goto(url)
})

test('has title', async ({ page }) => {
	await expect(page).toHaveTitle('Talk')
})

test('sign in button', async ({ page }) => {
	await page.getByRole('button', { name: 'Sign in' }).click()
	await expect(page).toHaveURL(/sign-in/)
})

test('from locale combo box', async ({ page }) => {
	await expect(page.getByRole('combobox').nth(0)).toHaveValue('en-US')
})

test('to locale combo box', async ({ page }) => {
	await expect(page.getByRole('combobox').nth(1)).toHaveValue('ja-JP')
})

test('changing locale, and then moving pages keeps saved locale', async ({ page }) => {
	await page.getByRole('combobox').first().selectOption('yue-HK');
	await page.getByRole('combobox').last().selectOption('km-KH');

	await page.goto(`${host}/translate`)
	
	await expect(page.getByRole('combobox').first()).toHaveValue('yue-HK')
	await expect(page.getByRole('combobox').last()).toHaveValue('km-KH')
})

test('Text count on main is same as that on translate', async ({ page }) => {
	const main_text_count = await page.locator('.text').count()
	await page.goto(`${host}/translate`)
	
	await expect(page.locator('.text')).toHaveCount(main_text_count)
})