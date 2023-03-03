import express from 'express'
import http from 'http'
import { handler } from './build/handler.js'; // <- Import SvelteKit handlers
import inject_socket_io from './socket-handler.js'; // The SocketIO stuff (see next step)

const app = express()
const server = http.createServer(app)

// Inject SocketIO
inject_socket_io(server)

// SvelteKit handlers
app.use(handler)

server.listen(3000, () => {
	console.log('Running on http://localhost:3000')
})
