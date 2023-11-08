// FILEPATH: /Users/morirei/Projects/talk/src/lib/view/message.test.ts

import { expect, test } from 'vitest'
import { Message } from './message'

test('constructor with valid text', () => {
	const message = new Message('valid text')
	expect(message.text).toEqual('valid text')
})

test('constructor with text containing spaces', () => {
	const message = new Message(' valid text ')
	expect(message.text).toEqual('valid text')
})

test('constructor with empty text', () => {
	expect(() => new Message('')).toThrow('text is empty')
})

test('constructor with text containing only spaces', () => {
	expect(() => new Message(' ')).toThrow('text is empty')
})

test('text getter', () => {
	const message = new Message('valid text')
	expect(message.text).toEqual('valid text')
})
