import { expect, test } from 'vitest'
import { AppSettingDb } from './app_setting_db'

test('session_lifetime_sec', async () => {
	const app_setting_db = new AppSettingDb('session_lifetime_sec')
	expect(await app_setting_db.get_number()).toBe(600)
})

test('pin_code_lifetime_sec', async () => {
	const app_setting_db = new AppSettingDb('pin_code_lifetime_sec')
	expect(await app_setting_db.get_number()).toBe(300)
})
