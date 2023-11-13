import { expect, test } from 'vitest'
import { ValidText } from './valid_text'

const test_cases = [
	{ input: '', expected_error: 'text is empty' },
	{ input: ' ', expected_error: 'text is empty' },
	{ input: undefined, expected_error: 'text is empty' },
	{ input: 'text', expected_message_id: 'text' },
	{ input: ' text ', expected_message_id: 'text' },
	{ input: ' text text ', expected_message_id: 'text text' },
	{ input: '	text	', expected_message_id: 'text' },
	{ input: '	text	text	', expected_message_id: 'text	text' },
]

test_cases.forEach(({ input, expected_error, expected_message_id }) => {
	test(`ValidText with input "${input}"`, () => {
		if (expected_error) {
			expect(() => new ValidText(input)).toThrow(expected_error)
		} else {
			const valid_text = new ValidText(input)
			expect(valid_text.text).toBe(expected_message_id)
			expect(ValidText.validate(input)).toBe(expected_message_id)
		}
	})
})
