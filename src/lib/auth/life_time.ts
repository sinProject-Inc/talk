import { Repository } from '$lib/app/repository'
import { SettingKey } from '$lib/app/setting_key'

export class LifeTime {
	private readonly _millisecond: number

	private constructor(life_time_millisecond: number) {
		if (life_time_millisecond <= 0) {
			throw new Error('life_time_millisecond must be greater than 0')
		}

		this._millisecond = life_time_millisecond
	}

	private static async _from_setting(setting_key: SettingKey): Promise<LifeTime> {
		const life_time_seconds = await Repository.app_setting.get_number(setting_key)
		const life_time_millisecond = life_time_seconds * 1000

		return new LifeTime(life_time_millisecond)
	}

	public static async generate_session(): Promise<LifeTime> {
		return await LifeTime._from_setting(SettingKey.session_lifetime_sec)
	}

	public static async generate_pin_code(): Promise<LifeTime> {
		return await LifeTime._from_setting(SettingKey.pin_code_lifetime_sec)
	}

	public get millisecond(): number {
		return this._millisecond
	}

	public get second(): number {
		return this._millisecond / 1000
	}

	public get limit_date(): Date {
		const now = new Date().getTime()
		const limit = new Date(now - this._millisecond)

		return limit
	}
}
