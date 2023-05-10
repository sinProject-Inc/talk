import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { Session } from '$lib/auth/session'
import { Signing } from '$lib/auth/signing'
import { ClientAddress } from '$lib/network/client_address'
import type { AuthToken, Role, User } from '@prisma/client'
import type { Handle, HandleServerError, RequestEvent } from '@sveltejs/kit'

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

function is_authorized_api(pathname: string): boolean {
	return pathname.startsWith('/api/') && !pathname.includes('/api/log')
}

async function find_auth_token(event: RequestEvent): Promise<
	| (AuthToken & {
			user: User & {
				role: Role
			}
	  })
	| null
> {
	const session = new Session(event.cookies)

	if (!session.id) return null

	return await Repository.auth_token.find(session)
}

export const handle: Handle = async ({ event, resolve }) => {
	const client_address = new ClientAddress(event.request, event.getClientAddress).value

	const auth_token = await find_auth_token(event)

	if (auth_token) {
		// logger.info(`true: ${auth_token}`)

		await Signing.access_valid(auth_token, event.cookies)

		event.locals.user = {
			email: auth_token.user.email,
			role: auth_token.user.role.name,
		}
	} else {
		// logger.info(`false: ${auth_token}`)

		if (is_authorized_api(event.url.pathname)) {
			logger.warn(
				`${client_address} [API] Unauthorized API request: [${event.request.method}] ${event.url}`
			)
			return new Response('Unauthorized', { status: 401 })
		}
	}

	if (event.url.pathname !== '/api/log') {
		logger.info(`${client_address} [${event.request.method}] ${event.url}`)
	}

	return await resolve(event)
}
