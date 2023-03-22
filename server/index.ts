import express from 'express'
import http from 'http'
import { handler } from '../build/handler.js' // <- Import SvelteKit handlers
import inject_socket_io from './socket-handler' // The SocketIO stuff (see next step)
import { logger } from '../src/lib/app/logger'

process.on('unhandledRejection', (reason, promise) => {
	logger.error('[process] Unhandled Rejection:', reason)
	console.log('Unhandled Rejection:', reason)
	process.exit(1)
})

process.on('uncaughtException', (error) => {
	logger.error('[process] Uncaught Exception:', error)
	console.log('Uncaught Exception at:', error)
	process.exit(1)
})

function shutdown_gracefully(): void {
	logger.info('[process] Shutting down gracefully')
	process.exit(1)
}

process.on('SIGINT', shutdown_gracefully)
process.on('SIGTERM', shutdown_gracefully)

const app = express()
const server = http.createServer(app)

// Inject SocketIO
inject_socket_io(server)

// SvelteKit handlers
app.use(handler)

server.listen(3000, () => {
	logger.info('[server] Running on http://localhost:3000')
})
