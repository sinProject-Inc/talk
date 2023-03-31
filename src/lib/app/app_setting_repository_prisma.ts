import type { PrismaClient } from '@prisma/client'
import type { AppSettingRepository } from './app_setting_repository'
import type { SettingKey } from './setting_key'

export class AppSettingRepositoryPrisma implements AppSettingRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async get_number(setting_key: SettingKey): Promise<number> {
		const app_setting = await this._prisma_client.appSetting.findUnique({
			where: { key: setting_key.key },
		})
		const number_value = Number(app_setting?.value)
		const number_value_not_nan = Number.isNaN(number_value) ? 0 : number_value

		return number_value_not_nan
	}
}
