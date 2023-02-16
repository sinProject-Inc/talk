import { expect, test } from 'vitest'
import { App } from './app'
import { AppSettingRepositoryPrisma } from './app_setting_repository_prisma'

test('session_lifetime_sec', async () => {
	const app_setting_repository = new AppSettingRepositoryPrisma(App.prisma_client)
	expect(await app_setting_repository.get_number('session_lifetime_sec')).toBe(600)
})

test('pin_code_lifetime_sec', async () => {
	const app_setting_repository = new AppSettingRepositoryPrisma(App.prisma_client)
	expect(await app_setting_repository.get_number('pin_code_lifetime_sec')).toBe(300)
})
