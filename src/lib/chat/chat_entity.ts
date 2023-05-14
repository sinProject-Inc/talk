import { UserId } from '../user/user_id'
import { ChatLocaleCode } from './chat_locale_code'
import { ChatMessage } from './chat_message'
import { ChatName } from './chat_name'
import { ChatRoomId } from './chat_room_id'

export class ChatEntity {
	private readonly _room_id: ChatRoomId
	private readonly _locale_code: ChatLocaleCode
	private readonly _name: ChatName
	private readonly _sender_id: UserId
	private readonly _message: ChatMessage

	public constructor(
		room_id: string,
		locale_code: string,
		name: string,
		sender_id: number,
		message: string
	) {
		this._room_id = new ChatRoomId(room_id)
		this._locale_code = new ChatLocaleCode(locale_code)
		this._name = new ChatName(name)
		this._sender_id = new UserId(sender_id)
		this._message = new ChatMessage(message)
	}

	public get room_id(): ChatRoomId {
		return this._room_id
	}

	public get locale_code(): ChatLocaleCode {
		return this._locale_code
	}

	public get name(): ChatName {
		return this._name
	}

	public get user_id(): UserId {
		return this._sender_id
	}

	public get message(): ChatMessage {
		return this._message
	}
}
