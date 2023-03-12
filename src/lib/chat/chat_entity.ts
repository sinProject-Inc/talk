import { LocaleCode } from '../language/locale_code'
import { ChatMessage } from './chat_message'
import { ChatName } from './chat_name'
import { ChatRoomId } from './chat_room_id'

export class ChatEntity {
	private readonly _room_id: ChatRoomId
	private readonly _locale_code: LocaleCode
	private readonly _name: ChatName
	private readonly _message: ChatMessage

	public constructor(room_id: string, locale_code: string, name: string, message: string) {
		this._room_id = new ChatRoomId(room_id)
		this._locale_code = LocaleCode.create(locale_code)
		this._name = new ChatName(name)
		this._message = new ChatMessage(message)
	}

	public get room_id(): ChatRoomId {
		return this._room_id
	}

	public get locale_code(): LocaleCode {
		return this._locale_code
	}

	public get name(): ChatName {
		return this._name
	}

	public get message(): ChatMessage {
		return this._message
	}
}
