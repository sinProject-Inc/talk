import { ValidText } from "../text/valid_text"

export class SpeechText {
	private readonly _speech_text: undefined
	private readonly _text: string

	public constructor(text: string | undefined) {
		const valid_text = new ValidText(text)

		this._text = valid_text.text
	}

	public get text(): string {
		return this._text
	}
}