import type { PreferNominal } from "$lib/value/value_object"
import { StringValueObject } from "../string_value_object"

export class SpeechText extends StringValueObject {
	public speech_text!: PreferNominal

	public constructor(value: string) {
		if (!value) throw new Error("speech_text is empty")

		super(value)
	}
}