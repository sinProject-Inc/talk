import { Repository } from '$lib/app/repository'

export class LifeTime {
	private readonly _millisecond: number

	private constructor(life_time_millisecond: number) {
		if (life_time_millisecond <= 0) {
			throw new Error('life_time_millisecond must be greater than 0')
		}

		this._millisecond = life_time_millisecond
	}

	private static async _from_setting(key: string): Promise<LifeTime> {
		const life_time_seconds = await Repository.app_setting.get_number(key)
		const life_time_millisecond = life_time_seconds * 1000

		return new LifeTime(life_time_millisecond)
	}

	public static async generate_session(): Promise<LifeTime> {
		return await LifeTime._from_setting('session_lifetime_sec')
	}

	public static async generate_pin_code(): Promise<LifeTime> {
		return await LifeTime._from_setting('pin_code_lifetime_sec')
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
