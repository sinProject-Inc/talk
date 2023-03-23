import type { ChatMember } from '@prisma/client'
import type { ChatMemberEntity } from '../chat/chat'

export interface ChatMemberRepository {
	find_unique(socket_id: string): Promise<ChatMember | null>
	find_many(room_id: string): Promise<ChatMember[]>
	find_translation_codes(room_id: string, current_locale_code: string): Promise<string[]>
	save(socket_id: string, chat_member_entity: ChatMemberEntity): Promise<ChatMember>
	delete(socket_id: string): Promise<void>
	delete_ghost(room_id: string, current_socket_ids: string[]): Promise<void>
	delete_all(): Promise<void>
}
