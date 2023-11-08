import { expect, test } from 'vitest'
import { TextError } from './text_error'

test('empty', () => {
	expect(() => new TextError('')).toThrow('text is empty')
})

test('space', () => {
	expect(() => new TextError(' ')).toThrow('text is empty')
})

test('text', () => {
	expect(new TextError('text').message_id).toEqual('text')
})

test('text with space', () => {
	expect(new TextError(' text ').message_id).toEqual('text')
})

test('text with spaces', () => {
	expect(new TextError(' text text ').message_id).toEqual('text text')
})

test('text with tab', () => {
	expect(new TextError('	text	').message_id).toEqual('text')
})

test('text with tabs', () => {
	expect(new TextError('	text	text	').message_id).toEqual('text	text')
})

test('message_id is text', () => {
	expect(new TextError('text').message_id).toEqual('text')
})
