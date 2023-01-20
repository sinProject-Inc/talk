import type { Cookies } from "@sveltejs/kit";

export class CookiesManager {
	private static readonly _session_id_key = 'session_id'

	public constructor(private readonly _cookies: Cookies) {}

	public get session_id(): string {
		return this._cookies.get(CookiesManager._session_id_key) ?? ''
	}

	public set_session_id(session_id: string, max_age_sec: number): void {
		this._cookies.set(CookiesManager._session_id_key, session_id, {
			path: '/',
			maxAge: max_age_sec,
			sameSite: 'lax',
			secure: true,
			// secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
		})
	}

	public delete_session_id(): void {
		this._cookies.delete(CookiesManager._session_id_key)
	}
}