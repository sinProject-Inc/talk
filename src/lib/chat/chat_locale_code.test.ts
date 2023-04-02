import { expect, test } from 'vitest'
import { ChatLocaleCode } from './chat_locale_code'

test('empty', () => {
	expect(() => new ChatLocaleCode('')).toThrow('ChatLocaleCode must be at least 1 character long.')
})

test('en-US', () => {
	expect(new ChatLocaleCode('en-US').value).toEqual('en-US')
})
