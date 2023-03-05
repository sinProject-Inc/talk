import { ChatMessage } from './chat_message'
import { ChatName } from './chat_name'

export class ChatEntity {
	private readonly _name: ChatName
	private readonly _message: ChatMessage

	public constructor(name: string, message: string) {
		this._name = new ChatName(name)
		this._message = new ChatMessage(message)
	}

	public get name(): ChatName {
		return this._name
	}

	public get message(): ChatMessage {
		return this._message
	}
}
