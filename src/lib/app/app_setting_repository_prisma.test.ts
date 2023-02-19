import { expect, test } from 'vitest'
import { Repository } from './repository'
import { SettingKey } from './setting_key'

test('session_lifetime_sec', async () => {
	expect(await Repository.app_setting.get_number(SettingKey.session_lifetime_sec)).toBe(600)
})

test('pin_code_lifetime_sec', async () => {
	expect(await Repository.app_setting.get_number(SettingKey.pin_code_lifetime_sec)).toBe(300)
})
