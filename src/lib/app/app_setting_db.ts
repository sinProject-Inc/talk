import { App } from "./app";

export class AppSettingDb {
	public constructor(private readonly _key: string) {}

	public async get_number(): Promise<number> {
		const app_setting = await App.db.appSetting.findUnique({ where: { key: this._key } })
		const number_value = Number(app_setting?.value)
		const number_value_not_nan = Number.isNaN(number_value) ? 0 : number_value

		// console.log('key', this._key)
		// console.log('number_value_not_nan', number_value_not_nan)

		return number_value_not_nan
	}
}