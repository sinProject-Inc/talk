import { expect, test } from 'vitest'
import { ChatMessage } from './chat_message'

test('empty', () => {
	expect(() => new ChatMessage('')).toThrow('ChatMessage must be at least 1 character long.')
})

test('en-US', () => {
	expect(new ChatMessage('Hello').value).toEqual('Hello')
})
