export class ChatRoomId {
	private readonly _value: string

	public constructor(value: string) {
		if (value.length < 1) {
			throw new Error('ChatRoomId must be at least 1 character long.')
		}

		this._value = value
	}

	public get value(): string {
		return this._value
	}
}
