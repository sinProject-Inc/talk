import type { AuthPin, AuthToken } from '@prisma/client'
import type { Cookies } from '@sveltejs/kit'
import { Session } from './session'
import { AuthPinDb } from './auth_pin_db'
import { AuthTokenDb } from './auth_token_db'

export class Signing {
	public static async sign_in(
		auth_pin: AuthPin,
		cookies: Cookies,
	): Promise<void> {
		const auth_token_db = new AuthTokenDb()
		const [auth_token, life_time] = await auth_token_db.create(auth_pin)

		new Session(cookies).set(auth_token, life_time)

		await new AuthPinDb().delete(auth_pin)
	}

	public static async sign_out(cookies: Cookies): Promise<void> {
		const session = new Session(cookies)
		const auth_token_db = new AuthTokenDb()

		await auth_token_db.delete(session)
		session.delete()
	}

	public static async access_valid(auth_token: AuthToken, cookies: Cookies): Promise<void> {
		const auth_token_db = new AuthTokenDb()
		const [updated_auth_token, life_time] = await auth_token_db.update(auth_token)

		new Session(cookies).set(updated_auth_token, life_time)
	}
}