import { expect, it } from 'vitest'
import { ChatLocaleCode } from './chat_locale_code'

it('empty', () => {
	expect(() => new ChatLocaleCode('')).toThrow('ChatLocaleCode must be at least 1 character long.')
})

it('en-US', () => {
	expect(new ChatLocaleCode('en-US').value).toEqual('en-US')
})
