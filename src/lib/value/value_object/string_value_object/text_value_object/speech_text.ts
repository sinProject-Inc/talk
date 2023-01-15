import type { PreferNominal } from "$lib/value/value_object"
import { TextValueObject } from "../text_value_object"

export class SpeechText extends TextValueObject {
	public speech_text!: PreferNominal
}