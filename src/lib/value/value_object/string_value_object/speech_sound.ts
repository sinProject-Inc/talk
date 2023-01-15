import type { PreferNominal } from "$lib/value/value_object"

export class SpeechSound {
	public speech_sound!: PreferNominal

	public constructor(private readonly _value: Uint8Array) {}

	public get unit8_array(): Uint8Array {
		return this._value
	}

	public get length(): number {
		return this._value.length
	}

	public get length_string(): string {
		return this.length.toString()
	}
}