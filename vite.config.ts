import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import type { UserConfig } from 'vite'
import inject_socket_io from './socket-handler'

// # Dev
// npm run dev

// # Production
// npm run build
// node server.js

const web_socket = {
	name: 'sveltekit-socket-io',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	configureServer(server: any): void {
		inject_socket_io(server.httpServer)
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
