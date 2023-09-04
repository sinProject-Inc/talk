import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { SettingKey } from '$lib/app/setting_key'
import { Email } from '$lib/auth/email'
import { IPAddress } from '$lib/auth/ip_address'
import { MailSubject } from '$lib/auth/mail_subject'
import { PinCode } from '$lib/auth/pin_code'
import { PinCodeMailer } from '$lib/auth/pin_code_mailer'
import { Signing } from '$lib/auth/signing'
import type { User } from '@prisma/client'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { sleep } from '$lib/general/system'

export const load: PageServerLoad = async ({ locals, url, request }) => {
	if (locals.user) {
		const redirect_url = url.searchParams.get('redirect_url') || ' /'
		throw redirect(302, redirect_url)
	}

	if (request.method !== 'POST') redirect(302, '/')
}

async function send_mail(user: User, pin_code: PinCode): Promise<void> {
	try {
		const to_mail = new Email(user.email)
		const mail_subject = new MailSubject(`${pin_code.code} is your PIN code.`)
		const gmail_node_mailer = new PinCodeMailer(to_mail, mail_subject, pin_code)

		await gmail_node_mailer.send()
	} catch (error) {
		logger.error(`[mail] Failed to send mail to ${user.email}`, error)
	}
}

export const actions: Actions = {
	sign_in: async ({ request }) => {
		const data = await request.formData()
		const email_address = data.get('email')?.toString() ?? ''

		let email: Email

		try {
			email = new Email(email_address)
		} catch (e) {
			logger.warn(`[pin-code] Invalid email address: ${email_address}`)

			return { credentials: false, email_address, missing: false, success: true }
		}

		try {
			const user = await Repository.user.find_unique(email)

			if (!user) return { credentials: true, email_address, missing: false, success: false }

			const pin_code = PinCode.generate()
			send_mail(user, pin_code)

			await Repository.auth_pin.save(user, pin_code)

			return { success: true, email_address, missing: false, credentials: false }
		} catch (e) {
			logger.error(`[pin-code] Failed to sign-in: ${email_address}]`, e)
			return { credentials: true, missing: false, success: false }

			// throw redirect(302, '/sign-in')
		}
	},
	// eslint-disable-next-line @typescript-eslint/naming-convention
	submit: async ({ cookies, request, getClientAddress }) => {
		const data = await request.formData()
		const email_address = data.get('email')?.toString() ?? ''

		try {
			const ip_address = new IPAddress(getClientAddress())
			const email = new Email(email_address)
			const pin_code = new PinCode(data.get('pin_code')?.toString())
			const auth_pin = await Repository.auth_pin.find(email, pin_code)
			const success = !!auth_pin

			await Repository.sign_in_log.save(ip_address, email, success)

			if (!success) {
				const consecutive_fail = await Repository.sign_in_log.consecutive_fail(ip_address, email)

				if (consecutive_fail) {
					const wait_sec = await Repository.app_setting.get_number(
						SettingKey.consecutive_fail_wait_sec
					)

					await sleep(1000 * wait_sec)
				}

				return fail(400, { credentials: true, email_address })
			}

			await Signing.sign_in(auth_pin, cookies)

			return { success: true, email_address }
		} catch (e) {
			logger.error(`[pin-code] Failed to submit: ${email_address}]`, e)

			return fail(400, { missing: true, email_address })
		}
	},
}
