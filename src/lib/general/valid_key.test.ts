import { expect, test } from 'vitest'
import { ValidKey } from './valid_key'

test('required', () => {
	expect(() => new ValidKey('')).toThrow('Key is required')
})

test('key access', () => {
	expect(new ValidKey('abc').key).toBe('abc')
})
