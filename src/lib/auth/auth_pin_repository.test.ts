import { Repository } from '$lib/app/repository'
import { expect, test } from 'vitest'
import { Email } from './email'
import { PinCode } from './pin_code'

test('find', async () => {
	const email = new Email('test2@example.com')
	const pin_code = new PinCode('123456')
	const user = await Repository.user.find_unique(email)

	if (!user) throw new Error('user is null')

	const saved_auth_pin = await Repository.auth_pin.save(user, pin_code)

	expect(saved_auth_pin.user_id).toEqual(user.id)

	const found_auth_pin = await Repository.auth_pin.find(email, pin_code)

	if (!found_auth_pin) throw new Error('auth_pin is null')

	expect(found_auth_pin.user_id).toEqual(user.id)

	await Repository.auth_pin.delete(found_auth_pin)

	const not_found_auth_pin = await Repository.auth_pin.find(email, pin_code)

	expect(not_found_auth_pin).toBeNull()
})
