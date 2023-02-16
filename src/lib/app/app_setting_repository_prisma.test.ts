import { expect, test } from 'vitest'
import { Repository } from './repository'

test('session_lifetime_sec', async () => {
	expect(await Repository.app_setting.get_number('session_lifetime_sec')).toBe(600)
})

test('pin_code_lifetime_sec', async () => {
	expect(await Repository.app_setting.get_number('pin_code_lifetime_sec')).toBe(300)
})
