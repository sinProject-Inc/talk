import { Repository } from '$lib/app/repository'
import type { AuthPin, AuthToken } from '@prisma/client'
import type { Cookies } from '@sveltejs/kit'
import { Session } from './session'

export class Signing {
	public static async sign_in(auth_pin: AuthPin, cookies: Cookies): Promise<void> {
		const [auth_token, life_time] = await Repository.auth_token.create(auth_pin)

		new Session(cookies).set(auth_token, life_time)

		await Repository.auth_pin.delete(auth_pin)
	}

	public static async sign_out(cookies: Cookies): Promise<void> {
		const session = new Session(cookies)

		await Repository.auth_token.delete(session)
		session.delete()
	}

	public static async access_valid(auth_token: AuthToken, cookies: Cookies): Promise<void> {
		const [updated_auth_token, life_time] = await Repository.auth_token.update(auth_token)

		new Session(cookies).set(updated_auth_token, life_time)
	}
}
