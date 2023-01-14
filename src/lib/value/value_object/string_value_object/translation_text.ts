import type { PreferNominal } from "$lib/value/value_object"
import { StringValueObject } from "../string_value_object"

export class TranslationText extends StringValueObject {
	public translation_text!: PreferNominal

	public constructor(value: string | undefined) {
		const trimmed_text = value?.trim() ?? ''

		if (!trimmed_text) throw new Error('translation_text is empty')
		if (trimmed_text.length > 1000) throw new Error('translation_text is too long')

		super(trimmed_text)
	}
}