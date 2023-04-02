import { expect, test } from 'vitest'
import { Repository } from './repository'
import { SettingKey } from './setting_key'

test('session_lifetime_sec', async () => {
	expect(await Repository.app_setting.get_number(SettingKey.session_lifetime_sec)).toEqual(600)
})

test('pin_code_lifetime_sec', async () => {
	expect(await Repository.app_setting.get_number(SettingKey.pin_code_lifetime_sec)).toEqual(300)
})

test('undefined: test_key', async () => {
	expect(await Repository.app_setting.get_number(SettingKey.test_key)).toEqual(0)
})
