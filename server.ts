import express from 'express'
import http from 'http'
import { handler } from './build/handler.js' // <- Import SvelteKit handlers
import inject_socket_io from './socket-handler' // The SocketIO stuff (see next step)
import { logger } from './src/lib/app/logger' // The SocketIO stuff (see next step)

const app = express()
const server = http.createServer(app)

// Inject SocketIO
inject_socket_io(server)

// SvelteKit handlers
app.use(handler)

server.listen(3000, () => {
	logger.info('[server] Running on http://localhost:3000')
})
