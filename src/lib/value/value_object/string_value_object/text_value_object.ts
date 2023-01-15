import type { PreferNominal } from "$lib/value/value_object"
import { StringValueObject } from "../string_value_object"

export abstract class TextValueObject extends StringValueObject {
	public text!: PreferNominal

	public constructor(value: string | undefined) {
		const trimmed_text = value?.trim() ?? ''

		if (!trimmed_text) throw new Error('speech_text is empty')

		super(trimmed_text)
	}
}