import { expect, test as setup } from '@playwright/test'
import { sleep } from '../src/lib/general/system.js'
import { get_pin_code_from_mail } from './lib/get_pin_code_from_mail.js'
import { auth_file_path, host } from './lib/setup.js'

const url = `${host}/sign-in`

setup('sign in', async ({ page }) => {
	setup.setTimeout(15 * 1000)

	await page.goto(url)

	const gmail_user = process.env.GMAIL_USER ?? ''

	await page.getByPlaceholder('Enter email').fill(gmail_user)
	await page.getByRole('button', { name: 'Continue' }).click()

	await expect(page).toHaveTitle('Talk - PIN code')

	await sleep(1000)

	const pin_code = await get_pin_code_from_mail()

	await page.getByPlaceholder('PIN code').fill(pin_code)
	await page.getByRole('button', { name: 'Submit' }).click()

	await expect(page).toHaveTitle('Talk')

	await page.context().storageState({ path: auth_file_path })
})
