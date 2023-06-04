import express from 'express'
import http from 'http'
import { handler } from '../build/handler.js' // <- Import SvelteKit handlers
import inject_socket_io from './socket-handler' // The SocketIO stuff (see next step)
import { logger } from '../src/lib/app/logger'
import morgan from 'morgan'

process.on('unhandledRejection', (reason) => {
	logger.error('[process] Unhandled Rejection:', reason)
	// eslint-disable-next-line no-console
	console.error('Unhandled Rejection:', reason)
	process.exit(1)
})

process.on('uncaughtException', (error) => {
	logger.error('[process] Uncaught Exception:', error)
	// eslint-disable-next-line no-console
	console.error('Uncaught Exception at:', error)
	process.exit(1)
})

function shutdown_gracefully(): void {
	logger.info('[process] Shutting down gracefully')
	process.exit(1)
}

const morgan_middleware = morgan('combined', {
	stream: {
		write: (message: string) => logger.http(message.trim()),
	},
})

process.on('SIGINT', shutdown_gracefully)
process.on('SIGTERM', shutdown_gracefully)

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000

app.set('trust proxy', true)

// Inject SocketIO
inject_socket_io(server)

// SvelteKit handlers
app.use(morgan_middleware)
app.use(handler)

server.listen(port, () => {
	logger.info(`[server] Running on http://localhost:${port}`)
})
