import type { ChatMember, PrismaClient } from '@prisma/client'
import type { ChatMemberEntity } from './chat'
import type { ChatMemberRepository } from './chat_member_repository'

export class ChatMemberRepositoryPrisma implements ChatMemberRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_unique(socket_id: string): Promise<ChatMember | null> {
		return await this._prisma_client.chatMember.findUnique({
			where: {
				socket_id,
			},
		})
	}

	public async find_many(room_id: string): Promise<ChatMember[]> {
		return this._prisma_client.chatMember.findMany({
			where: {
				room_id,
			},
			orderBy: {
				created_at: 'asc',
			},
		})
	}

	public async find_translation_codes(
		room_id: string,
		current_locale_code: string
	): Promise<string[]> {
		const member_locales = await this._prisma_client.chatMember.findMany({
			where: {
				room_id,
				locale_code: { not: current_locale_code },
			},
			select: {
				locale_code: true,
			},
			distinct: ['locale_code'],
		})

		const locale_codes = member_locales.map((member_language) => member_language.locale_code)

		return locale_codes
	}

	public async save(socket_id: string, chat_member_entity: ChatMemberEntity): Promise<ChatMember> {
		return await this._prisma_client.chatMember.create({
			data: {
				socket_id,
				room_id: chat_member_entity.room_id,
				name: chat_member_entity.name,
				locale_code: chat_member_entity.locale_code,
				is_mobile_device: chat_member_entity.is_mobile_device,
			},
		})
	}

	public async delete(socket_id: string): Promise<void> {
		await this._prisma_client.chatMember.delete({
			where: {
				socket_id,
			},
		})
	}

	public async delete_ghost(room_id: string, current_socket_ids: string[]): Promise<void> {
		await this._prisma_client.chatMember.deleteMany({
			where: {
				room_id,
				socket_id: { notIn: current_socket_ids },
			},
		})
	}

	public async delete_all(): Promise<void> {
		await this._prisma_client.chatMember.deleteMany()
	}
}
