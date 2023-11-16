import { expect, test } from 'vitest'
import { TextError } from './text_error'

type Spec = {
	input: string
	expected_error?: string
	expected?: string
}

const specs: Spec[] = [
	{ input: '', expected_error: 'text is empty' },
	{ input: ' ', expected_error: 'text is empty' },
	{ input: 'text', expected: 'text' },
	{ input: ' text ', expected: 'text' },
	{ input: ' text text ', expected: 'text text' },
	{ input: '	text	', expected: 'text' },
	{ input: '	text	text	', expected: 'text	text' },
]

test.each(specs)('new TextError($input) -> ($expected) : (expected_error)', (spec: Spec) => {
	const { input, expected, expected_error } = spec

	if (expected_error) {
		expect(() => new TextError(input)).toThrow(expected_error)

		return
	}

	expect(new TextError(input).message_id).toEqual(expected)
})
