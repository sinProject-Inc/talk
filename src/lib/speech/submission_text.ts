import { TextError } from '../general/text_error'
import type { BaseText } from "../text/base_text"
import { ValidText } from '../text/valid_text'

export class SubmissionText implements BaseText {
	private readonly _submission_text: undefined
	private readonly _text: string

	public constructor(text: string | undefined) {
		const valid_text = new ValidText(text)

    if (valid_text.text.length > 250) throw new TextError('text_limit')

		this._text = valid_text.text
	}

	public get text(): string {
		return this._text
	}
}
