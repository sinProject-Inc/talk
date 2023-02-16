import type { AuthPin, AuthToken } from '@prisma/client'
import type { Cookies } from '@sveltejs/kit'
import { Session } from './session'
import { AuthPinRepositoryPrisma } from './auth_pin_repository_prisma'
import { AuthTokenRepositoryPrisma } from './auth_token_repository_prisma'
import type { AuthTokenRepository } from './auth_token_repository'

export class Signing {
	public static async sign_in(
		auth_pin: AuthPin,
		cookies: Cookies,
	): Promise<void> {
		const auth_token_repository: AuthTokenRepository = new AuthTokenRepositoryPrisma()
		const [auth_token, life_time] = await auth_token_repository.create(auth_pin)

		new Session(cookies).set(auth_token, life_time)

		await new AuthPinRepositoryPrisma().delete(auth_pin)
	}

	public static async sign_out(cookies: Cookies): Promise<void> {
		const session = new Session(cookies)
		const auth_token_repository: AuthTokenRepository = new AuthTokenRepositoryPrisma()

		await auth_token_repository.delete(session)
		session.delete()
	}

	public static async access_valid(auth_token: AuthToken, cookies: Cookies): Promise<void> {
		const auth_token_repository: AuthTokenRepository = new AuthTokenRepositoryPrisma()
		const [updated_auth_token, life_time] = await auth_token_repository.update(auth_token)

		new Session(cookies).set(updated_auth_token, life_time)
	}
}