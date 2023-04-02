import { expect, test } from 'vitest'
import { ChatName } from './chat_name'

test('empty', () => {
	expect(() => new ChatName('')).toThrow('ChatName must be at least 1 character long.')
})

test('en-US', () => {
	expect(new ChatName('Ryan').value).toEqual('Ryan')
})
