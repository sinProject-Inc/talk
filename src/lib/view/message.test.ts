import { expect, it } from 'vitest'
import { Message } from './message'

type Spec = {
	text: string
	expected?: string
	expected_error?: string
}

const specs: Spec[] = [
	{ text: '', expected_error: 'text is empty' },
	{ text: ' ', expected_error: 'text is empty' },
	{ text: 'text', expected: 'text' },
	{ text: ' text ', expected: 'text' },
	{ text: ' text text ', expected: 'text text' },
	{ text: '	text	', expected: 'text' },
	{ text: '	text	text	', expected: 'text	text' },
]

it.each(specs)('new Message($text) -> ($expected) : (expected_error)', (spec: Spec) => {
	const { text, expected, expected_error } = spec

	if (expected_error) {
		expect(() => new Message(text)).toThrow(expected_error)

		return
	}

	expect(new Message(text).text).toEqual(expected)
})
