import type { PreferNominal } from "$lib/value/value_object"
import { TextValueObject } from "../text_value_object"

export class TranslationText extends TextValueObject {
	public translation_text!: PreferNominal

	public constructor(value: string | undefined) {
		const length = value?.length ?? 0

		if (length > 200) throw new Error(`translation_text is too long: ${value} (${length})}`)

		super(value)
	}
}