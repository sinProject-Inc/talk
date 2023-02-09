import { ValidText } from "$lib/text/valid_text"

export class TextError {
  private readonly _text_error: undefined
  private readonly _message_id: string

  public constructor(message_id: string) {
		const valid_text = new ValidText(message_id)

    this._message_id = valid_text.text
  }

  public get message_id(): string {
    return this._message_id
  }
}
