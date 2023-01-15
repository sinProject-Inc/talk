import type { PreferNominal } from "$lib/value/value_object"
import { TextValueObject } from "../text_value_object"

export class Message extends TextValueObject {
	public message!: PreferNominal
}