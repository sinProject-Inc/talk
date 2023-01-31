import { AuthPinDb } from '$lib/auth/auth_pin_db'
import { UserDb } from '$lib/auth/user_db'
import { PinCodeMailer } from '$lib/auth/pin_code_mailer'
import { PinCode } from '$lib/auth/pin_code'
import { Signing } from '$lib/auth/signing'
import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types'
import type { User } from '@prisma/client'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { Email } from '$lib/auth/email'
import { MailSubject } from '$lib/auth/mail_subject'

export const load: PageServerLoad = async ({ locals, url, request }) => {
	if (locals.user) {
		const redirect_url = url.searchParams.get('redirect_url') || ' /'
		throw redirect(302, redirect_url)
	}

	if (request.method != 'POST') redirect(302, '/')
}

async function send_mail(user: User, pin_code: PinCode): Promise<void> {
	try {
		const to_mail = new Email(user.email)
		const mail_subject = new MailSubject('sinProject Talk - PIN Code')
		const gmail_node_mailer = new PinCodeMailer(to_mail, mail_subject, pin_code)

		await gmail_node_mailer.send()
	} catch (error) {
		console.error(error)
	}
}

export const actions: Actions = {
	sign_in: async ({ request }) => {
		const data = await request.formData()
		const email_address = data.get('email')?.toString() ?? ''

		try {
			const email = new Email(email_address)

			const user_db = new UserDb(email)
			const user = await user_db.find_unique()

			if (!user) return { credentials: true, email_address, missing: false, success: false }

			const pin_code = PinCode.generate()
			send_mail(user, pin_code)

			const auth_pin_db = new AuthPinDb()

			await auth_pin_db.upsert(user, pin_code)

			return { success: true, email_address, missing: false, credentials: false }
		} catch (e) {
			console.error(e)
			return { credentials: true, missing: false, success: false }

			// TODO: Show message on page
			throw redirect(302, '/sign-in')
		}
	},
	submit: async ({ cookies, request }) => {
		// console.log('submit')
		const data = await request.formData()
		const email_address = data.get('email')?.toString() ?? ''

		try {
			const email = new Email(email_address)
			const pin_code = new PinCode(data.get('pin_code')?.toString())

			const auth_pin_db = new AuthPinDb()
			const auth_pin = await auth_pin_db.find(email, pin_code)

			if (!auth_pin) return fail(400, { credentials: true, email_address })

			await Signing.sign_in(auth_pin, cookies)

			return { success: true, email_address }
		} catch (e) {
			console.error(e)

			return fail(400, { missing: true, email_address })
		}
	},
}
