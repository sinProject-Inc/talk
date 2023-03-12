/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'
import { ChatEntity } from './src/lib/chat/chat_entity'
import { ChatLogRepositoryPrisma } from './src/lib/chat/chat_log_repository_prisma'
import { LocaleCode } from './src/lib/language/locale_code'
import { SpeechLanguageCode } from './src/lib/speech/speech_language_code'
import { SpeechText } from './src/lib/speech/speech_text'
import { GetTextService } from './src/lib/text/get_text_service'
import { TextRepositoryPrisma } from './src/lib/text/text_repository_prisma'
import { GetTranslationService } from './src/lib/translation/get_translation_service'
import { TranslationRepositoryPrisma } from './src/lib/translation/translation_repository_prisma'

const base_url = 'http://localhost:5173'

const prisma_client = new PrismaClient()

/**
 * @param {ChatEntity} chat_entity
 * @returns {Promise<import('@prisma/client').ChatLog>}
 */
async function save_chat_log(chat_entity) {
	const chat_log_repository = new ChatLogRepositoryPrisma(prisma_client)
	const chat_log = await chat_log_repository.save(chat_entity)

	return chat_log
}

/**
 *
 * @param {import('@prisma/client').ChatLog} chat_log
 * @returns {Promise<import('@prisma/client').Text>}
 */
async function get_text(chat_log) {
	const text_repository = new TextRepositoryPrisma(prisma_client)
	const speech_language_code = SpeechLanguageCode.create_from_locale_code(
		LocaleCode.create(chat_log.locale_code)
	)
	const speech_text = new SpeechText(chat_log.message)
	const get_text_service = new GetTextService(text_repository, speech_language_code, speech_text)
	const text = await get_text_service.execute()

	return text
}

/**
 *
 * @param {*} io
 * @param {string} room_id
 * @param {string} locale_code
 * @returns {string[]}
 */
function get_translation_locales(io, room_id, locale_code) {
	const room_members = get_room_members(io, room_id)
	const room_local_codes = Array.from(new Set(room_members.map((member) => member.locale_code)))
	const translation_locales = room_local_codes.filter(
		(room_locale_code) => room_locale_code !== locale_code
	)

	return translation_locales
}

/**
 *
 * @param {import('@prisma/client').Text} text
 * @param {string} translation_locale
 * @returns {Promise<void>}
 */
async function get_translation(text, translation_locale) {
	const translation_repository = new TranslationRepositoryPrisma(prisma_client)
	const speech_language_code = SpeechLanguageCode.create_from_locale_code(
		LocaleCode.create(translation_locale)
	)

	const get_translation_service = new GetTranslationService(
		translation_repository,
		text,
		speech_language_code,
		fetch,
		base_url
	)

	await get_translation_service.execute()
}

/**
 *
 * @param {import('@prisma/client').Text} text
 * @param {string[]} translation_locales
 * @returns {Promise<void>}
 */
async function get_translations(text, translation_locales) {
	/** @type {Promise<void>[]} */
	const promises = []

	translation_locales.forEach(async (locale_code) => {
		promises.push(get_translation(text, locale_code))
	})

	await Promise.all(promises)
}

/**
 *
 * @param {ChatEntity} chat_entity
 * @param {*} io
 * @param {string} room_id
 * @returns {Promise<import('@prisma/client').ChatLog>}
 */
async function save(chat_entity, io, room_id) {
	const chat_log = await save_chat_log(chat_entity)
	const text = await get_text(chat_log)
	const translation_locales = get_translation_locales(io, room_id, chat_log.locale_code)
	const translations = await get_translations(text, translation_locales)

	return chat_log
}

/**
 *
 * @param {string} room_id
 * @returns {Promise<import('@prisma/client').ChatLog[]>}
 */
async function find_many(room_id) {
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

/**
 * @typedef {Object} MessageData
 * @property {string} locale_code
 * @property {string} name
 * @property {string} message
 */

/**
 * @type {Map<string, ChatMember>}
 */
const chat_member_map = new Map()

/**
 *
 * @param {*} socket
 * @returns {string}
 */
function get_room_id(socket) {
	return chat_member_map.get(socket.id)?.room_id ?? ''
}

/**
 *
 * @param {*} io
 * @param {*} socket
 * @param {MessageData} received_message_data
 * @returns {Promise<void>}
 */
async function on_message(io, socket, received_message_data) {
	console.log(received_message_data)

	try {
		const room_id = get_room_id(socket)
		const chat_entity = new ChatEntity(
			room_id,
			received_message_data.locale_code,
			received_message_data.name,
			received_message_data.message
		)

		const chat_log = await save(chat_entity, io, room_id)

		io.to(room_id).emit('message', chat_log)
		console.info('message:', chat_log.name, chat_log.created_at, chat_log.message)
	} catch (error) {
		console.error(error)

		// TODO: 再ログインを促す
	}
}

/**
 * @typedef {Object} ChatMember
 * @property {string} room_id
 * @property {string} name
 * @property {string} locale_code
 */

/**
 *
 * @param {*} socket
 * @returns {Promise<void>}
 */
async function send_logs(socket) {
	const room_id = get_room_id(socket)

	const chat_logs = await find_many(room_id)

	socket.emit('logs', chat_logs)
}

/**
 *
 * @param {*} io
 * @param {string} room_id
 * @returns {ChatMember[]}
 */
function get_room_members(io, room_id) {
	const clients = io.sockets.adapter.rooms.get(room_id)

	if (!clients) return []

	// members から room_id に該当するものを抽出
	// HACK: undefined が含まれてしまう
	const room_members = [...clients]
		.map((client) => chat_member_map.get(client))
		.filter((member) => member != undefined)

	// room_members から undefined を取り除く
	/** @type {ChatMember[]} */
	const chat_members = []

	room_members.forEach((member) => {
		if (member) chat_members.push(member)
	})

	return chat_members
}

/**
 *
 * @param {*} io
 * @param {string} room_id
 * @returns {void}
 */
function send_members(io, room_id) {
	const room_members = get_room_members(io, room_id)

	io.to(room_id).emit('members', room_members)
}

/**
 *
 * @param {*} io
 * @param {*} socket
 * @param {ChatMember} member_data
 * @returns {Promise<void>}
 */
async function join(io, socket, member_data) {
	const room_id = member_data.room_id

	if (!room_id) throw new Error('Room id is required')

	chat_member_map.set(socket.id, member_data)
	socket.join(room_id)

	send_members(io, room_id)
	console.info('join:', member_data)
	await send_logs(socket)

	// // TODO: メッセージ変更
	// const chat_entity = new ChatEntity(room_id, 'en-US', 'SERVER', `${member_data.name} joined`)
	// const chat_log = await save(chat_entity)

	// io.to(member_data.room_id).emit('message', chat_log)
}

/**
 *
 * @param {*} io
 * @param {*} socket
 * @returns {Promise<void>}
 */
async function leave(io, socket) {
	const room_id = get_room_id(socket)
	const member_data = chat_member_map.get(socket.id)

	if (!member_data) return

	console.log('leave', member_data.name)

	chat_member_map.delete(socket.id)
	socket.leave(room_id)
	send_members(io, room_id)

	// const chat_entity = new ChatEntity(room_id, 'en-US', 'SERVER', `${member_data.name} leaved`)
	// const chat_log = await save(chat_entity)

	// io.to(room_id).emit('message', chat_log)
}

/**
 *
 * @param {*} io
 * @param {*} socket
 * @returns {Promise<void>}
 */
async function on_connection(io, socket) {
	socket.on('join', (member_data) => join(io, socket, member_data))
	socket.on('message', async (received_data) => on_message(io, socket, received_data))
	socket.on('leave', () => leave(io, socket))
	socket.on('disconnect', () => leave(io, socket))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 *
 * @param {any} server
 * @returns {void}
 */
export default function inject_socket_io(server) {
	const io = new Server(server)

	io.on('connection', (socket) => on_connection(io, socket))
}
