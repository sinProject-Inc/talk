import { Server } from 'socket.io'

export default function inject_socket_io(server) {
	const io = new Server(server)

	io.on('connection', (socket) => {
		socket.emit('message', { name: 'SERVER', message: 'Hello from the server' })

		socket.on('message', (message_set) => {
			io.emit('message', message_set)
			console.info('message:', message_set.name, message_set.message)
		})
	})
}
