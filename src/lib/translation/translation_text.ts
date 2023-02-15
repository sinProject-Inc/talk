import type { BaseText } from '../text/base_text'
import { ValidText } from '../text/valid_text'

export class TranslationText implements BaseText {
	private readonly _text: string

	public constructor(text: string | undefined) {
		const valid_text = new ValidText(text)
		const length = valid_text.text.length

		if (length > 700) throw new Error(`translation_text is too long: ${text} (${length})}`)

		this._text = valid_text.text
	}

	public get text(): string {
		return this._text
	}
}
