import { expect, it } from 'vitest'
import { ValidKey } from './valid_key'

it('required', () => {
	expect(() => new ValidKey('')).toThrow('Key is required')
})

it('key access', () => {
	expect(new ValidKey('abc').key).toBe('abc')
})
