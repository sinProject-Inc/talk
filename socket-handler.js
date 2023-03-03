import { Server } from 'socket.io'

export default function inject_socket_io(server) {
	const io = new Server(server)

	io.on('connection', (socket) => {
		socket.emit('message', 'Hello from the server')

		socket.on('message', (message) => {
			io.emit('message', message)
			console.info('message:', message)
		})
	})
}
