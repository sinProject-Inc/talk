import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { Session } from '$lib/auth/session'
import { Signing } from '$lib/auth/signing'
import { ClientAddress } from '$lib/network/client_address'
import type { Handle, HandleServerError } from '@sveltejs/kit'

// NOTE: https://kit.svelte.jp/docs/errors
// eslint-disable-next-line @typescript-eslint/naming-convention
export const handleError: HandleServerError = ({ error, event }) => {
	const client_address = new ClientAddress(event.request, event.getClientAddress).value

	const { code } = error as { code?: string }
	const { message } = error as { message?: string }

	if (message?.startsWith('Not found')) {
		logger.warn(`${client_address} [SERVER] 404: ${message}`)
	} else {
		logger.error(`${client_address} [SERVER] Unhandled Error:`, error, { event })
	}

	// eslint-disable-next-line no-console
	// console.error('[server] Unhandled Error:', error)

	return {
		code: code ?? 'UNKNOWN',
		message: 'Whoops!',
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname !== '/api/log') {
		const client_address = new ClientAddress(event.request, event.getClientAddress).value
		logger.info(`${client_address} [${event.request.method}] ${event.url}`)
	}

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
