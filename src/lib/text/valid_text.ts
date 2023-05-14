export class ValidText {
	private readonly _text: string

	public constructor(text: string | undefined) {
		const trimmed_text = text?.trim() ?? ''

		if (!trimmed_text) throw new Error('text is empty')

		this._text = trimmed_text
	}

	public get text(): string {
		return this._text
	}
}
