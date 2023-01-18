export class SpeechSound {
	private readonly _speech_sound: undefined

	public constructor(private readonly _value: Uint8Array) {}

	public get data(): Uint8Array {
		return this._value
	}

	public get length(): number {
		return this._value.length
	}

	public get length_string(): string {
		return this.length.toString()
	}
}