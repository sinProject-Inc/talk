import { ChatMessage } from './chat_message'
import { ChatName } from './chat_name'

export class ChatEntity {
	private readonly _locale_code: string
	private readonly _name: ChatName
	private readonly _message: ChatMessage

	public constructor(locale_code: string, name: string, message: string) {
		this._locale_code = locale_code
		this._name = new ChatName(name)
		this._message = new ChatMessage(message)
	}

	public get locale_code(): string {
		return this._locale_code
	}

	public get name(): ChatName {
		return this._name
	}

	public get message(): ChatMessage {
		return this._message
	}
}
