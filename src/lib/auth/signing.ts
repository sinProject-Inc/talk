import type { Cookies } from '@sveltejs/kit'
import { CookiesManager } from '../cookies_manager'
import { AuthPinDb } from './auth_pin_db'
import { AuthTokenDb } from './auth_token_db'

export class Signing {
	public static async sign_in(
		user_id: number,
		cookies: Cookies,
		pin_code_id?: number
	): Promise<void> {
		const auth_token_db = new AuthTokenDb()
		const [auth_token, life_time] = await auth_token_db.create(user_id)

		new CookiesManager(cookies).set_session_id(auth_token.token, life_time.second)

		if (pin_code_id) {
			await new AuthPinDb().delete(pin_code_id)
		}
	}

	public static async sign_out(cookies: Cookies): Promise<void> {
		const cookies_manager = new CookiesManager(cookies)
		const auth_token_db = new AuthTokenDb()

		await auth_token_db.delete(cookies_manager.session_id)
		cookies_manager.delete_session_id()
	}

	public static async access_valid(auth_token_id: number, cookies: Cookies): Promise<void> {
		const auth_token_db = new AuthTokenDb()
		const [auth_token, life_time] = await auth_token_db.update(auth_token_id)

		new CookiesManager(cookies).set_session_id(auth_token.token, life_time.second)
	}
}