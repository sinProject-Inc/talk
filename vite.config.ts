import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { Server } from 'socket.io'

const web_socket = {
	name: 'sveltekit-socket-io',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	configureServer(server: any): void {
		const io = new Server(server.httpServer)

		io.on('connection', (socket: any) => {
			socket.on('message', (data: any) => {
				io.emit('message', data)
				console.info('message:', data)
			})
		})
	}
}

const config: UserConfig = {
	plugins: [sveltekit(), SvelteKitPWA(), web_socket],
	define: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'import.meta.vitest': 'undefined',
	},
	test: {
		include: ['src/**/*.test.ts'],
	},
}

export default config
