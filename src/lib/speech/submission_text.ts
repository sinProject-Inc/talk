import { ValidText } from '../text/valid_text'

export class SubmissionText {
	private readonly _submission_text: undefined
	private readonly _text: string

	public constructor(text: string | undefined) {
		const valid_text = new ValidText(text)

    if (valid_text.text.length > 250) throw new Error('text is too long', { cause: { code: 'TextTooLong' } })

		this._text = valid_text.text
	}

	public get text(): string {
		return this._text
	}
}
