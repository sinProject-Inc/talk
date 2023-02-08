export class TextError {
  private readonly _text_error: undefined
  private readonly _message_id: string

  public constructor(message_id: string) {
    this._message_id = message_id
  }

  public get message_id(): string {
    return this._message_id
  }
}
