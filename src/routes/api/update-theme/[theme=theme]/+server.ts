import { Repository } from '$lib/app/repository'
import { Email } from '$lib/auth/email'
import type { Theme } from '@prisma/client'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ locals, params }) => {
	try {
		if (!params.theme) throw new Error('Theme not found')

		const theme = params.theme as Theme

		const email = new Email(locals.user.email)
		const user = await Repository.user.find_unique(email)

		if (!user) throw new Error('User not found')

		const result = await Repository.user.update_theme(user, theme)

		return json(result)
	} catch (error) {
		return new Response((error as Error).message, { status: 400 })
	}
}
