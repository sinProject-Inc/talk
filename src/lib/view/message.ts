import { ValidText } from '../text/valid_text'

export class Message {
	private readonly _text: string

	public constructor(text: string) {
		this._text = ValidText.validate(text)
	}

	public get text(): string {
		return this._text
	}
}
