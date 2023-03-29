import type { ChatLog, PrismaClient } from '@prisma/client'
import type { ChatEntity } from './chat_entity'
import type { ChatLogRepository } from './chat_log_repository'

export class ChatLogRepositoryPrisma implements ChatLogRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_many(): Promise<ChatLog[]> {
		return this._prisma_client.chatLog.findMany()
	}

	public async save(chat_entity: ChatEntity): Promise<ChatLog> {
		return await this._prisma_client.chatLog.create({
			data: {
				room_id: chat_entity.room_id.value,
				locale_code: chat_entity.locale_code.value,
				name: chat_entity.name.value,
				message: chat_entity.message.value,
			},
		})
	}
}
