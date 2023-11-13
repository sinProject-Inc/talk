import { expect, test } from 'vitest'
import { TextError } from './text_error'

const test_cases = [
	{ input: '', expected_error: 'text is empty' },
	{ input: ' ', expected_error: 'text is empty' },
	{ input: 'text', expected_message_id: 'text' },
	{ input: ' text ', expected_message_id: 'text' },
	{ input: ' text text ', expected_message_id: 'text text' },
	{ input: '	text	', expected_message_id: 'text' },
	{ input: '	text	text	', expected_message_id: 'text	text' },
]

test.each(test_cases)(
	'TextError with input "%s"',
	({ input, expected_error, expected_message_id }) => {
		if (expected_error) {
			expect(() => new TextError(input)).toThrow(expected_error)
		} else {
			expect(new TextError(input).message_id).toEqual(expected_message_id)
		}
	}
)
