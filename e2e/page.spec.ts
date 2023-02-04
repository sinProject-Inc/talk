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

test('language combo box', async ({ page }) => {
	await expect(page.getByRole('combobox').first()).toHaveValue('en')
})

test('locale combo box', async ({ page }) => {
	await expect(page.getByRole('combobox').nth(1)).toHaveValue('en-US')
})
