import { PrismaClient } from '@prisma/client'

type AppSettingsSeed = {
	key: string
	value: string
}

export class AppSettingSeeder {
	private static readonly _seeds: AppSettingsSeed[] = [
		{ key: 'session_lifetime_sec', value: '600' },
		{ key: 'pin_code_lifetime_sec', value: '300' },
	]

	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async execute(): Promise<void> {
		for (const seed of AppSettingSeeder._seeds) {
			const key = seed.key
			const value = seed.value

			await this._prisma_client.appSetting.upsert({
				where: { key },
				update: {},
				create: { key, value },
			})
		}
	}
}
