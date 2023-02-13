import type { AuthToken } from '@prisma/client'
import type { Cookies } from '@sveltejs/kit'
import type { LifeTime } from './life_time'

export class Session {
	private static readonly _session_id_key = 'session_id'

	public constructor(private readonly _cookies: Cookies) {}

	public get id(): string {
		return this._cookies.get(Session._session_id_key) ?? ''
	}

	public set(auth_token: AuthToken, life_time: LifeTime): void {
		this._cookies.set(Session._session_id_key, auth_token.token, {
			path: '/',
			maxAge: life_time.second,
			sameSite: 'lax',
			secure: true,
			// secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
		})
	}

	public delete(): void {
		this._cookies.delete(Session._session_id_key)
	}
}
