import { expect, it } from 'vitest'
import { ValidId } from './valid_id'

it('NaN', () => {
	expect(() => new ValidId(NaN)).toThrow('id is not number')
})

it('0', () => {
	expect(() => new ValidId(0)).toThrow('id is not positive number')
})

it('1', () => {
	expect(new ValidId(1).id).toEqual(1)
})
