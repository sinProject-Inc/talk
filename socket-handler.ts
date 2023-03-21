import { PrismaClient, type ChatLog, type Text } from '@prisma/client'
import type http from 'http'
import { Server, Socket } from 'socket.io'
import { logger } from './src/lib/app/logger'
import type { ChatMember, MessageSet } from './src/lib/chat/chat'
import { ChatEntity } from './src/lib/chat/chat_entity'
import { ChatLogRepositoryPrisma } from './src/lib/chat/chat_log_repository_prisma'
import { LocaleCode } from './src/lib/locale/locale_code'
import { SpeechText } from './src/lib/speech/speech_text'
import { GetTextService } from './src/lib/text/get_text_service'
import { TextRepositoryPrisma } from './src/lib/text/text_repository_prisma'
import { GetTranslationService } from './src/lib/translation/get_translation_service'
import { TranslationRepositoryPrisma } from './src/lib/translation/translation_repository_prisma'

const prisma_client = new PrismaClient()

async function save_chat_log(chat_entity: ChatEntity): Promise<ChatLog> {
	const chat_log_repository = new ChatLogRepositoryPrisma(prisma_client)
	const chat_log = await chat_log_repository.save(chat_entity)

	return chat_log
}

async function get_text(chat_log: ChatLog): Promise<Text> {
	const text_repository = new TextRepositoryPrisma(prisma_client)
	const speech_text = new SpeechText(chat_log.message)
	const locale_code = new LocaleCode(chat_log.locale_code)
	const get_text_service = new GetTextService(text_repository, locale_code, speech_text)
	const text = await get_text_service.execute()

	return text
}

function get_translation_locales(io: Server, room_id: string, locale_code: string): string[] {
	const room_members = get_room_members(io, room_id)
	const room_local_codes = Array.from(new Set(room_members.map((member) => member.locale_code)))
	const translation_locales = room_local_codes.filter(
		(room_locale_code) => room_locale_code !== locale_code
	)

	return translation_locales
}

async function get_translation(text: Text, translation_locale: string): Promise<void> {
	const translation_repository = new TranslationRepositoryPrisma(prisma_client)
	const locale_code = new LocaleCode(translation_locale)
	const get_translation_service = new GetTranslationService(
		translation_repository,
		text,
		locale_code
	)

	await get_translation_service.execute()
}

async function get_translations(text: Text, translation_locales: string[]): Promise<void> {
	const promises: Promise<void>[] = []

	translation_locales.forEach(async (locale_code) => {
		promises.push(get_translation(text, locale_code))
	})

	await Promise.all(promises)
}

async function save(chat_entity: ChatEntity, io: Server, room_id: string): Promise<ChatLog> {
	const chat_log = await save_chat_log(chat_entity)
	const text = await get_text(chat_log)
	const translation_locales = get_translation_locales(io, room_id, chat_log.locale_code)

	await get_translations(text, translation_locales)

	return chat_log
}

async function find_many(room_id: string): Promise<ChatLog[]> {
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

const chat_member_map = new Map<string, ChatMember>()

function get_room_id(socket: Socket): string {
	return chat_member_map.get(socket.id)?.room_id ?? ''
}

async function on_message(
	io: Server,
	socket: Socket,
	received_message_set: MessageSet
): Promise<void> {
	try {
		const room_id = get_room_id(socket)

		logger.info(
			`[socket][${room_id}] ${received_message_set.name}: ${received_message_set.message}`
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
		logger.error('[socket] on_message error', error)

		// TODO: 再ログインを促す
	}
}

async function send_logs(socket: Socket): Promise<void> {
	const room_id = get_room_id(socket)

	const chat_logs = await find_many(room_id)

	socket.emit('logs', chat_logs)
}

function get_room_members(io: Server, room_id: string): ChatMember[] {
	const clients = io.sockets.adapter.rooms.get(room_id)

	if (!clients) return []

	// members から room_id に該当するものを抽出
	// HACK: undefined が含まれてしまう
	const room_members = [...clients]
		.map((client) => chat_member_map.get(client))
		.filter((member) => member != undefined)

	// room_members から undefined を取り除く
	const chat_members: ChatMember[] = []

	room_members.forEach((member) => {
		if (member) chat_members.push(member)
	})

	return chat_members
}

function send_members(io: Server, room_id: string): void {
	const room_members = get_room_members(io, room_id)

	io.to(room_id).emit('members', room_members)
}

function send_joined_member(io: Server, room_id: string, member_data: ChatMember): void {
	io.to(room_id).emit('join', member_data)
}

function send_leaved_member(io: Server, room_id: string, member_data: ChatMember): void {
	io.to(room_id).emit('leave', member_data)
}

async function join(io: Server, socket: Socket, member_data: ChatMember): Promise<void> {
	const room_id = member_data.room_id

	if (!room_id) throw new Error('Room id is required')

	chat_member_map.set(socket.id, member_data)
	socket.join(room_id)

	send_members(io, room_id)
	send_joined_member(io, room_id, member_data)
	await send_logs(socket)

	logger.info(`[socket][${room_id}] ${member_data.name} joined`)
}

async function leave(io: Server, socket: Socket): Promise<void> {
	const room_id = get_room_id(socket)
	const member_data = chat_member_map.get(socket.id)

	if (!member_data) return

	chat_member_map.delete(socket.id)
	socket.leave(room_id)
	send_members(io, room_id)
	send_leaved_member(io, room_id, member_data)

	logger.info(`[socket][${room_id}] ${member_data.name} reaved`)
}

async function on_connection(io: Server, socket: Socket): Promise<void> {
	socket.on('join', (member_data) => join(io, socket, member_data))
	socket.on('message', async (received_data) => on_message(io, socket, received_data))
	socket.on('leave', () => leave(io, socket))
	socket.on('disconnect', () => leave(io, socket))
}

export default function inject_socket_io(server: http.Server): void {
	const io = new Server(server)

	io.on('connection', (socket) => on_connection(io, socket))
}
