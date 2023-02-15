import { expect, test } from 'vitest'
import type { AppSettingRepository } from './app_setting_repository'
import { AppSettingRepositoryPrisma } from './app_setting_repository_prisma'

test('session_lifetime_sec', async () => {
	const app_setting_repository: AppSettingRepository = new AppSettingRepositoryPrisma('session_lifetime_sec')
	expect(await app_setting_repository.get_number()).toBe(600)
})

test('pin_code_lifetime_sec', async () => {
	const app_setting_repository: AppSettingRepository = new AppSettingRepositoryPrisma('pin_code_lifetime_sec')
	expect(await app_setting_repository.get_number()).toBe(300)
})
