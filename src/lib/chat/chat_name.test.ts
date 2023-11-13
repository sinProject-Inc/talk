import { expect, it } from 'vitest'
import { ChatName } from './chat_name'

it('empty', () => {
	expect(() => new ChatName('')).toThrow('ChatName must be at least 1 character long.')
})

it('en-US', () => {
	expect(new ChatName('Ryan').value).toEqual('Ryan')
})
