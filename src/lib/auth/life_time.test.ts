import { expect, it } from 'vitest'
import { LifeTime } from './life_time'

it('generate_zero', async () => {
	expect(() => LifeTime.generate_zero()).toThrow('life_time_millisecond must be greater than 0')
})

it('generate_session', async () => {
	expect(await LifeTime.generate_session()).toBeTruthy()
})

it('generate_pin_code', async () => {
	expect(await LifeTime.generate_pin_code()).toBeTruthy()
})

it('millisecond', async () => {
	expect((await LifeTime.generate_session()).millisecond).toEqual(1000 * 60 * 60 * 24 * 3)
})

it('second', async () => {
	expect((await LifeTime.generate_session()).second).toEqual(60 * 60 * 24 * 3)
})

it('limit_date', async () => {
	const life_time = await LifeTime.generate_session()
	const millisecond = life_time.millisecond
	const now = new Date().getTime()
	const limit = new Date(now - millisecond)

	expect(life_time.limit_date.getSeconds).toEqual(limit.getSeconds)
})
