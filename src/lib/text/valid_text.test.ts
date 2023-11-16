import { expect, test } from 'vitest'
import { ValidText } from './valid_text'

type Spec = {
	input: string | undefined
	expected_error?: string
	expected_message?: string
}

const specs: Spec[] = [
	{ input: '', expected_error: 'text is empty' },
	{ input: ' ', expected_error: 'text is empty' },
	{ input: undefined, expected_error: 'text is empty' },
	{ input: 'text', expected_message: 'text' },
	{ input: ' text ', expected_message: 'text' },
	{ input: ' text text ', expected_message: 'text text' },
	{ input: '	text	', expected_message: 'text' },
	{ input: '	text	text	', expected_message: 'text	text' },
]

test.each(specs)('new ValidText($input) -> ($expected) : (expected_error)', (spec: Spec) => {
	const { input, expected_message, expected_error } = spec

	if (expected_error) {
		expect(() => new ValidText(input)).toThrow(expected_error)

		return
	}

	expect(new ValidText(input).text).toBe(expected_message)
})
