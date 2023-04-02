import { expect, test } from 'vitest'
import { ChatRoomId } from './chat_room_id'

test('empty', () => {
	expect(() => new ChatRoomId('')).toThrow('ChatRoomId must be at least 1 character long.')
})

test('en-US', () => {
	expect(new ChatRoomId('room-01').value).toEqual('room-01')
})
