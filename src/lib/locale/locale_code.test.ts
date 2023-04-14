import { expect, test } from 'vitest'
import { LocaleCode } from './locale_code'

test('empty', () => {
	expect(() => new LocaleCode('')).toThrow('LocaleCode is required')
})

test('en', () => {
	expect(() => new LocaleCode('en')).toThrow('LocaleCode must include a hyphen')
})

test('en-US', () => {
	expect(new LocaleCode('en-US').code).toEqual('en-US')
})
