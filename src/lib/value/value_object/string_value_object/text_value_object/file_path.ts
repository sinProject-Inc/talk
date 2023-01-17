import type { PreferNominal } from "$lib/value/value_object"
import { TextValueObject } from "../text_value_object"

export class SoundFilePath extends TextValueObject {
	public file_path!: PreferNominal
}