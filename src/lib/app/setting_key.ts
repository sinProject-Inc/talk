import { ValidKey } from '$lib/general/valid_key'

export class SettingKey {
	private readonly _key: string

	public static readonly test_key = new SettingKey('test_key')

	public static readonly session_lifetime_sec = new SettingKey('session_lifetime_sec')
	public static readonly pin_code_lifetime_sec = new SettingKey('pin_code_lifetime_sec')
	public static readonly consecutive_fail_period_sec = new SettingKey('consecutive_fail_period_sec')
	public static readonly consecutive_fail_count = new SettingKey('consecutive_fail_count')
	public static readonly consecutive_fail_wait_sec = new SettingKey('consecutive_fail_wait_sec')

	public constructor(key: string) {
		const valid_key = new ValidKey(key)

		this._key = valid_key.key
	}

	public get key(): string {
		return this._key
	}
}
