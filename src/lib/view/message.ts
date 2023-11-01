import { ValidText } from '../text/valid_text'

export class Message {
	private readonly _text: string

	public constructor(text: string) {
		const valid_text = new ValidText(text)

		this._text = valid_text.text
	}

	public get text(): string {
		return this._text
	}
}
