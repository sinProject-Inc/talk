import { expect, test } from 'vitest'
import { ValidId } from './valid_id'

test('NaN', () => {
	expect(() => {
		new ValidId(NaN)
	}).toThrow('id is not number')
})

test('0', () => {
	expect(() => {
		new ValidId(0)
	}).toThrow('id is not positive number')
})

test('1', () => {
	expect(new ValidId(1).id).toBe(1)
})
