import type { PreferNominal } from "$lib/value/value_object"
import { Id } from "./id"

export class TextId extends Id {
	public text_id!: PreferNominal

	public static from_string(value: string | undefined): TextId {
		value = value?.trim() ?? ''

		if (!value) throw new Error('value is empty')

		return new TextId(Number(value))
	}

	public get number(): number {
		return this._value
	}
}