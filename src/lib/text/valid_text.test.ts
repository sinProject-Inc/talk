import { expect, test } from 'vitest'
import { ValidText } from './valid_text'

test('empty', () => {
	expect(() => new ValidText('')).toThrow('text is empty')
})

test('text is undefined', () => {
	expect(() => new ValidText(undefined)).toThrow('text is empty')
})

test('space', () => {
	expect(() => new ValidText(' ')).toThrow('text is empty')
})

test('text', () => {
	expect(new ValidText('text').text).toEqual('text')
})

test('text with space', () => {
	expect(new ValidText(' text ').text).toEqual('text')
})

test('validate text', () => {
	expect(ValidText.validate('text')).toEqual('text')
})

test('validate text with space', () => {
	expect(ValidText.validate(' text ')).toEqual('text')
})

test('validate text with spaces', () => {
	expect(ValidText.validate(' text text ')).toEqual('text text')
})
