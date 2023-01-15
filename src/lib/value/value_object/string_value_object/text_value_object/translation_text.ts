import type { PreferNominal } from "$lib/value/value_object"
import { TextValueObject } from "../text_value_object"

export class TranslationText extends TextValueObject {
	public translation_text!: PreferNominal

	public constructor(value: string | undefined) {
		if (value?.length ?? 0 > 1000) throw new Error('translation_text is too long')

		super(value)
	}
}