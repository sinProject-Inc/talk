import { expect, test as setup } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { auth_file_path } from './lib/setup.js'

async function get_pin_code_from_database(gmail_user: string): Promise<string> {
	const prisma_client = new PrismaClient()

	const auth_pin = await prisma_client.authPin.findFirst({
		where: { user: { email: gmail_user } },
		orderBy: { updated_at: 'desc' },
	})

	if (!auth_pin) throw Error('auth_pin is null')

	return auth_pin.pin_code
}

setup('sign in', async ({ page }) => {
	await page.goto('./sign-in', { waitUntil: 'networkidle' })

	const gmail_user = process.env.GMAIL_USER ?? ''

	await page.getByPlaceholder('Enter email').fill(gmail_user)
	await page.getByRole('button', { name: 'Continue' }).click()
	await page.waitForURL(/\/pin-code/)
	await page.waitForLoadState('networkidle')

	await expect(page).toHaveTitle('PIN code - Talk')

	const pin_code = await get_pin_code_from_database(gmail_user)

	await page.getByPlaceholder('PIN code').fill(pin_code)
	await page.getByRole('button', { name: 'Submit' }).click()
	await page.waitForURL(/\/$/)

	await expect(page).toHaveTitle('Talk')

	await page.context().storageState({ path: auth_file_path })
})
