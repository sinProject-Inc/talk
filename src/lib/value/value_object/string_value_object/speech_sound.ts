import type { PreferNominal } from "$lib/value/value_object"

export class SpeechSound {
	public speech_sound!: PreferNominal

	public constructor(private readonly _value: Uint8Array) {}

	public get value(): Uint8Array {
		return this._value
	}
}