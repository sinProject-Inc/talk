import { PrismaClient, type ChatLog, type ChatMember, type Text } from '@prisma/client'
import { ChatMemberRepositoryPrisma } from '../src/lib/chat/chat_member_repository_prisma'
// import { createAdapter } from '@socket.io/cluster-adapter'
// import { setupWorker } from '@socket.io/sticky'
import { createAdapter } from '@socket.io/redis-adapter'
import type http from 'http'
import { createClient } from 'redis'
import { Server, Socket } from 'socket.io'
import { logger } from '../src/lib/app/logger'
import type { ChatMemberEntity, MessageSet } from '../src/lib/chat/chat'
import { ChatEntity } from '../src/lib/chat/chat_entity'
import { ChatLogRepositoryPrisma } from '../src/lib/chat/chat_log_repository_prisma'
import { LocaleCode } from '../src/lib/locale/locale_code'
import { SpeechText } from '../src/lib/speech/speech_text'
import { GetTextService } from '../src/lib/text/get_text_service'
import { TextRepositoryPrisma } from '../src/lib/text/text_repository_prisma'
import { GetTranslationService } from '../src/lib/translation/get_translation_service'
import { TranslationRepositoryPrisma } from '../src/lib/translation/translation_repository_prisma'
import { SocketClientAddress } from '../src/lib/network/socket_client_address'

const prisma_client = new PrismaClient()
const chat_member_repository = new ChatMemberRepositoryPrisma(prisma_client)
const chat_log_repository = new ChatLogRepositoryPrisma(prisma_client)
const text_repository = new TextRepositoryPrisma(prisma_client)
const translation_repository = new TranslationRepositoryPrisma(prisma_client)

async function save_chat_log(chat_entity: ChatEntity): Promise<ChatLog> {
	const chat_log = await chat_log_repository.save(chat_entity)

	return chat_log
}

async function get_text(chat_log: ChatLog): Promise<Text> {
	const speech_text = new SpeechText(chat_log.message)
	const locale_code = new LocaleCode(chat_log.locale_code)
	const get_text_service = new GetTextService(text_repository, locale_code, speech_text)
	const text = await get_text_service.execute()

	return text
}

async function get_translation_locale_codes(
	room_id: string,
	locale_code: string
): Promise<string[]> {
	const translation_locale_codes = await chat_member_repository.find_translation_codes(
		room_id,
		locale_code
	)

	return translation_locale_codes
}

async function get_translation(text: Text, translation_locale: string): Promise<void> {
	const locale_code = new LocaleCode(translation_locale)
	const get_translation_service = new GetTranslationService(
		translation_repository,
		text,
		locale_code
	)

	await get_translation_service.execute()
}

async function get_translations(text: Text, translation_locale_codes: string[]): Promise<void> {
	const promises: Promise<void>[] = []

	translation_locale_codes.forEach(async (locale_code) => {
		promises.push(get_translation(text, locale_code))
	})

	await Promise.all(promises)
}

async function save(chat_entity: ChatEntity, io: Server, room_id: string): Promise<ChatLog> {
	const chat_log = await save_chat_log(chat_entity)
	const text = await get_text(chat_log)
	const translation_locale_codes = await get_translation_locale_codes(room_id, chat_log.locale_code)

	await get_translations(text, translation_locale_codes)

	return chat_log
}

async function find_logs(room_id: string): Promise<ChatLog[]> {
	return await prisma_client.chatLog.findMany({
		where: {
			room_id,
		},
		orderBy: {
			created_at: 'desc',
		},
		take: 10,
	})
}

function get_room_id(socket: Socket): string {
	const socket_rooms = socket.rooms
	const socket_id = socket.id

	for (const socket_room of socket_rooms) {
		if (socket_room !== socket_id) {
			return socket_room
		}
	}

	return ''
}

async function on_message(
	io: Server,
	socket: Socket,
	received_message_set: MessageSet
): Promise<void> {
	const client_address = new SocketClientAddress(socket).value

	try {
		const room_id = get_room_id(socket)

		if (!room_id) return

		logger.info(
			`${client_address} [SOCKET][${room_id}] ${received_message_set.name}: ${received_message_set.message}`
		)

		const chat_entity = new ChatEntity(
			room_id,
			received_message_set.locale_code,
			received_message_set.name,
			received_message_set.message
		)

		const chat_log = await save(chat_entity, io, room_id)

		io.to(room_id).emit('message', chat_log)
	} catch (error) {
		logger.error(`${client_address} [SOCKET] on_message error`, error)

		// TODO: 再ログインを促す
	}
}

async function send_logs(socket: Socket): Promise<void> {
	const room_id = get_room_id(socket)

	if (!room_id) return

	const chat_logs = await find_logs(room_id)

	socket.emit('logs', chat_logs)
}

async function find_room_members(io: Server, room_id: string): Promise<ChatMember[]> {
	const sockets = await io.in(room_id).fetchSockets()
	const socket_ids = sockets.map((socket) => socket.id)

	await chat_member_repository.delete_ghost(room_id, socket_ids)
	const room_members = await chat_member_repository.find_many(room_id)

	return room_members
}

async function send_members(io: Server, room_id: string): Promise<void> {
	const room_members = await find_room_members(io, room_id)

	// room_members を ChatMemberEntity[] に変換
	const room_member_entities = room_members.map((room_member) => {
		return {
			room_id: room_member.room_id,
			name: room_member.name,
			locale_code: room_member.locale_code,
			is_mobile_device: room_member.is_mobile_device,
		} as ChatMemberEntity
	})

	io.to(room_id).emit('members', room_member_entities)
}

function send_joined_member(
	io: Server,
	room_id: string,
	chat_member_entity: ChatMemberEntity
): void {
	io.to(room_id).emit('join', chat_member_entity)
}

function send_leaved_member(
	io: Server,
	room_id: string,
	chat_member_entity: ChatMemberEntity
): void {
	io.to(room_id).emit('leave', chat_member_entity)
}

async function join(
	io: Server,
	socket: Socket,
	chat_member_entity: ChatMemberEntity
): Promise<void> {
	const room_id = chat_member_entity.room_id
	const socket_id = socket.id

	if (!room_id) throw new Error('Room id is required')

	await chat_member_repository.save(socket_id, chat_member_entity)
	socket.join(room_id)

	send_joined_member(io, room_id, chat_member_entity)
	await send_members(io, room_id)
	await send_logs(socket)

	const client_address = new SocketClientAddress(socket).value

	logger.info(`${client_address} [SOCKET][${room_id}] ${chat_member_entity.name} joined`)
}

async function leave(io: Server, socket: Socket): Promise<void> {
	const room_id = get_room_id(socket)

	if (!room_id) return

	const socket_id = socket.id
	const chat_member = await chat_member_repository.find_unique(socket_id)

	if (!chat_member) return

	await chat_member_repository.delete(socket_id)
	socket.leave(room_id)

	send_leaved_member(io, room_id, chat_member)
	await send_members(io, room_id)

	const client_address = new SocketClientAddress(socket).value

	logger.info(`${client_address} [SOCKET][${room_id}] ${chat_member.name} reaved`)
}

async function on_connection(io: Server, socket: Socket): Promise<void> {
	socket.on('join', (chat_member_entity) => join(io, socket, chat_member_entity))
	socket.on('message', async (received_data) => on_message(io, socket, received_data))
	socket.on('leave', () => leave(io, socket))
	socket.on('disconnect', () => leave(io, socket))
}

async function adapt_redis(io: Server): Promise<void> {
	const pub_client = createClient()
	const sub_client = pub_client.duplicate()
	const redis_adapter = createAdapter(pub_client, sub_client)

	await pub_client.connect()
	await sub_client.connect()

	io.adapter(redis_adapter)
}

export default async function inject_socket_io(server: http.Server): Promise<void> {
	const io = new Server(server)

	adapt_redis(io)

	// io.adapter(createAdapter())
	// setupWorker(io)

	io.on('connection', (socket) => on_connection(io, socket))
}
