// import { Repository } from './src/lib/app/repository'
// import { ChatEntity } from './src/lib/chat/chat_entity'
import { Server } from 'socket.io'
// import { Repository } from '$lib/app/repository'

// async function save(chat_entity: ChatEntity): Promise<void> {
// 	await Repository.chat_log.save(chat_entity)
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * 
 * @param {any} server 
 * @returns void
 */
export default function inject_socket_io(server) {
	const io = new Server(server)

	io.on('connection', (socket) => {
		socket.emit('message', { name: 'SERVER', message: 'Hello from the server' })

		socket.on('message', async (message_set) => {
			// const chat_entity = new ChatEntity(message_set.name, message_set.message)

			// await save(chat_entity)

			io.emit('message', message_set)
			console.info('message:', message_set.name, message_set.message)
		})
	})
}
