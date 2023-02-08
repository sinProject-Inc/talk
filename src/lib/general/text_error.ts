export class TextError extends Error {
  private readonly _text_error: undefined
  private readonly _message_id: string

  public constructor(message_id: string) {
    super()

    this._message_id = message_id
  }

  public get message_id(): string {
    return this._message_id
  }
}
