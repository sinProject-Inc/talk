import { ValidText } from '$lib/text/valid_text'

export class TextError {
	private readonly _message_id: string

	public constructor(message_id: string) {
		this._message_id = ValidText.validate(message_id)
	}

	public get message_id(): string {
		return this._message_id
	}
}
