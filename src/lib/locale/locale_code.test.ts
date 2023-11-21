import { expect, it } from 'vitest'
import { LocaleCode } from './locale_code'

it('empty', () => {
	expect(() => new LocaleCode('')).toThrow('LocaleCode is required')
})

it('en', () => {
	expect(() => new LocaleCode('en')).toThrow('LocaleCode must include a hyphen')
})

it('en-US', () => {
	expect(new LocaleCode('en-US').code).toEqual('en-US')
})
