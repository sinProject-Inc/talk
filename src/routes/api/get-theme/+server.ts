import { Repository } from '$lib/app/repository'
import { Email } from '$lib/auth/email'
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ locals }) => {
	const email = new Email(locals.user.email)
	const user = await Repository.user.find_unique(email)

	if (!user) {
		throw new Error('User not found')
	}

	const theme = user.theme
	const response = new Response(JSON.stringify(theme))

	return response
}
