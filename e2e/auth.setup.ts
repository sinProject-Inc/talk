import { expect, test as setup } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
// import { promises as fs } from 'fs'
// import { sleep } from '../src/lib/general/system.js'
// import { get_pin_code_from_mail } from './lib/get_pin_code_from_mail.js'
import { auth_file_path } from './lib/setup.js'

// async function find_auth_file(): Promise<boolean> {
// 	try {
// 		await fs.access(auth_file_path, fs.constants.F_OK)
// 		return true
// 	} catch {
// 		return false
// 	}
// }

// async function get_pin_code_from_mail(): Promise<string> {
// 	await sleep(process.env.CI ? 5000 : 1000)
// 	const pin_code = await get_pin_code_from_mail()
// 	expect(pin_code).toMatch(/^\d{6}$/)

// 	return pin_code
// }

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
	setup.setTimeout(20 * 1000)

	// if (await find_auth_file()) return

	await page.goto('./sign-in', { waitUntil: 'networkidle' })

	const gmail_user = process.env.GMAIL_USER ?? ''

	// expect(gmail_user).toEqual('iam.o.sin@gmail.com')

	await page.getByPlaceholder('Enter email').fill(gmail_user)
	await page.getByRole('button', { name: 'Continue' }).click()
	await page.waitForURL(/\/pin-code/)
	await page.waitForLoadState('networkidle')

	await expect(page).toHaveTitle('Talk - PIN code')

	const pin_code = await get_pin_code_from_database(gmail_user)

	await page.getByPlaceholder('PIN code').fill(pin_code)
	await page.getByRole('button', { name: 'Submit' }).click()
	await page.waitForURL(/\/$/)

	await expect(page).toHaveTitle('Talk')

	await page.context().storageState({ path: auth_file_path })
})
