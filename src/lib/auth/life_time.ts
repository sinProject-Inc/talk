import { AppSettingDb } from "../app/app_setting_db"

export class LifeTime {
	private readonly _life_time: undefined
	private readonly _second: number

	private constructor(life_time_sec: number) {
		if (life_time_sec <= 0) throw new Error('life_time_sec must be greater than 0')

		this._second = life_time_sec
	}

	private static async _from_setting(key: string): Promise<LifeTime> {
		const app_setting_db = new AppSettingDb(key)
		const life_time_sec = await app_setting_db.get_number()

		return new LifeTime(life_time_sec)
	}

	public static async generate_session(): Promise<LifeTime> {
		return await LifeTime._from_setting('session_lifetime_sec')
	}

	public static async generate_pin_code(): Promise<LifeTime> {
		return await LifeTime._from_setting('pin_code_lifetime_sec')
	}

	public get second(): number {
		return this._second
	}

	public get limit_date(): Date {
		const limit = new Date()

		limit.setSeconds(limit.getSeconds() - this._second)

		return limit
	}
}