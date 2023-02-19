import { ValidKey } from "$lib/general/valid_key"

export class SettingKey {
	private readonly _key: string

	public static readonly session_lifetime_sec = new SettingKey('session_lifetime_sec')
	public static readonly pin_code_lifetime_sec = new SettingKey('pin_code_lifetime_sec')

	public constructor(key: string) {
		const valid_key = new ValidKey(key)

		this._key = valid_key.key
	}

	public get key(): string {
		return this._key
	}
}