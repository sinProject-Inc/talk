import type { PreferNominal } from "$lib/value/value_object"
import { StringValueObject } from "../string_value_object"

export class Message extends StringValueObject {
	public message!: PreferNominal

	public constructor(value: string | undefined) {
		const trimmed_text = value?.trim() ?? ''

		if (!trimmed_text) throw new Error('message is empty')

		super(trimmed_text)
	}
}