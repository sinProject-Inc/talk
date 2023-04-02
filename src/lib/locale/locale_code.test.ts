import { expect, test } from 'vitest'
import { LocaleCode } from './locale_code'

test('empty', () => {
	expect(() => new LocaleCode('')).toThrow('Code is required')
})

test('en', () => {
	expect(() => new LocaleCode('en')).toThrow('Code must contain a hyphen')
})

test('en-US', () => {
	expect(new LocaleCode('en-US').code).toEqual('en-US')
})
