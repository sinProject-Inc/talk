import { AuthPinDb } from '$lib/auth/auth_pin_db'
import { UserDb } from '$lib/auth/user_db'
import { NodemailerManager as NodeMailerManager } from '$lib/nodemailer_manager'
import { PinCode } from '$lib/auth/pin_code'
import { Signing } from '$lib/auth/signing'
import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types'
import type { User } from '@prisma/client'
import { fail, redirect, type Actions } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, url, request }) => {
	if (locals.user) {
		const redirect_url = url.searchParams.get('redirect_url') || ' /'
		throw redirect(302, redirect_url)
	}

	if (request.method != 'POST') redirect(302, '/')
}

async function send_mail(user: User, pin_code: PinCode): Promise<void> {
	const nodeMailerManager = new NodeMailerManager()
	try {
		await nodeMailerManager.send_mail(
			user.email,
			'sinProject Talk\n',
			pin_code
		)
	} catch (error) {
		console.error(error)
	}
}

export const actions: Actions = {
	sign_in: async ({ request }) => {
		const data = await request.formData()
		const email = data.get('email')?.toString() ?? ''

		if (!email) throw redirect(302, '/')

		const user_db = new UserDb(email)
		const user = await user_db.find_unique()

		if (!user) return { credentials: true, email, missing: false, success: false }

		const pin_code = PinCode.generate()
		send_mail(user, pin_code)

		const auth_pin_db = new AuthPinDb()

		await auth_pin_db.upsert(user, pin_code)

		return { success: true, email, missing: false, credentials: false }
	},
	submit: async ({ cookies, request }) => {
		console.log('submit')
		const data = await request.formData()
		const email = data.get('email')?.toString() ?? ''
		const pin_code = data.get('pin_code')?.toString() ?? ''

		if (!email || !pin_code) return fail(400, { missing: true, email })

		const auth_pin_db = new AuthPinDb()
		const auth_pin = await auth_pin_db.find(email, pin_code)

		if (!auth_pin) return fail(400, { credentials: true, email })

		await Signing.sign_in(auth_pin.user_id, cookies, auth_pin.id)

		return { success: true, email }
	},
}
