import { Auth } from '$lib/auth'
import { Database, db } from '$lib/general/database'
import { NodemailerManager as NodeMailerManager } from '$lib/nodemailer_manager'
import { PinCode } from '$lib/pin_code'
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

		const user = await Database.find_user(email, true)

		if (!user) return { credentials: true, email, missing: false, success: false }

		const pin_code = PinCode.generate()
		send_mail(user, pin_code)

		const user_id = user.id

		await db.authPin.upsert({
			where: { user_id },
			update: { pin_code: pin_code.code },
			create: { user_id, pin_code: pin_code.code },
		})

		return { success: true, email, missing: false, credentials: false }
	},
	submit: async ({ cookies, request }) => {
		console.log('submit')
		const data = await request.formData()
		const email = data.get('email')?.toString() ?? ''
		const pin_code = data.get('pin_code')?.toString() ?? ''

		if (!email || !pin_code) return fail(400, { missing: true, email })

		const auth_pin = await Auth.find_auth_pin(email, pin_code)

		if (!auth_pin) return fail(400, { credentials: true, email })

		await Auth.sign_in(auth_pin.user_id, cookies, auth_pin.id)

		return { success: true, email }
	},
}
