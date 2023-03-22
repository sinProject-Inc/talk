import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { Session } from '$lib/auth/session'
import { Signing } from '$lib/auth/signing'
import type { Handle } from '@sveltejs/kit'
import type { HandleServerError } from '@sveltejs/kit'

// NOTE: https://kit.svelte.jp/docs/errors
// eslint-disable-next-line @typescript-eslint/naming-convention
export const handleError: HandleServerError = ({ error, event }) => {
	logger.error('[server] Unhandled Error:', error, { event })
	console.error('[server] Unhandled Error:', error)

	return {
		message: 'Whoops!',
		code: error?.code ?? 'UNKNOWN',
	}
}

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
