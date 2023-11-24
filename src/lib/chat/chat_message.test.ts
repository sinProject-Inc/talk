import { expect, it } from 'vitest'
import { ChatMessage } from './chat_message'

it('empty', () => {
	expect(() => new ChatMessage('')).toThrow('ChatMessage must be at least 1 character long.')
})

it('en-US', () => {
	expect(new ChatMessage('Hello').value).toEqual('Hello')
})
