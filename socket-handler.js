/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */

// import { Repository } from './src/lib/app/repository'
import { ChatEntity } from './src/lib/chat/chat_entity'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

/**
 * @typedef {Object} MessageSet
 * @property {string} locale_code
 * @property {string} name
 * @property {string} message
 */

const prisma_client = new PrismaClient()

/**
 *
 * @param {ChatEntity} chat_entity
 * @returns {Promise<import('@prisma/client').ChatLog>}
 */
async function save(chat_entity) {
	return await prisma_client.chatLog.create({
		data: {
			locale_code: chat_entity.locale_code,
			name: chat_entity.name.value,
			message: chat_entity.message.value,
		},
	})
}

/**
 *
 * @returns {Promise<import('@prisma/client').ChatLog[]>}
 */
async function find_many() {
	return await prisma_client.chatLog.findMany({
		orderBy: {
			created_at: 'desc',
		},
		take: 10,
	})
}

/**
 *
 * @param {*} io
 * @param {MessageSet} received_data
 */
async function on_message(io, received_data) {
	const chat_entity = new ChatEntity(received_data.locale_code, received_data.name, received_data.message)
	const chat_log = await save(chat_entity)

	io.emit('message', chat_log)
	console.info('message:', chat_log.name, chat_log.created_at, chat_log.message)
}

/**
 *
 * @param {*} io
 * @param {*} socket
 */
async function on_connection(io, socket) {
	const chat_logs = await find_many()

	socket.emit('logs', chat_logs)
	socket.on('message', async (received_data) => on_message(io, received_data))
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
