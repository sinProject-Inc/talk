import { Repository } from '$lib/app/repository'
import { Session } from '$lib/auth/session'
import { Signing } from '$lib/auth/signing'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const session = new Session(event.cookies) 

	if (!session.id) return await resolve(event)

	const auth_token = await Repository.auth_token.find(session)

	if (!auth_token) return await resolve(event)

	await Signing.access_valid(auth_token, event.cookies)

	event.locals.user = {
		email: auth_token.user.email,
		role: auth_token.user.role.name,
	}

	return await resolve(event)
}
