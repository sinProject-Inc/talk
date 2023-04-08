import { expect, test } from 'vitest'
import { LifeTime } from './life_time'

test('generate_zero', async () => {
	expect(() => LifeTime.generate_zero()).toThrow('life_time_millisecond must be greater than 0')
})

test('generate_session', async () => {
	expect(await LifeTime.generate_session()).toBeTruthy()
})

test('generate_pin_code', async () => {
	expect(await LifeTime.generate_pin_code()).toBeTruthy()
})

test('millisecond', async () => {
	expect((await LifeTime.generate_session()).millisecond).toEqual(600 * 1000)
})

test('second', async () => {
	expect((await LifeTime.generate_session()).second).toEqual(600)
})

test('limit_date', async () => {
	const life_time = await LifeTime.generate_session()
	const millisecond = life_time.millisecond
	const now = new Date().getTime()
	const limit = new Date(now - millisecond)

	expect(life_time.limit_date.getSeconds).toEqual(limit.getSeconds)
})
