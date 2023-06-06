import { sveltekit } from '@sveltejs/kit/vite'
import { createRequire } from 'module'
import path from 'path'
import { defineConfig } from 'vitest/config'
import inject_socket_io from './server/socket-handler'

const require = createRequire(import.meta.url)

const prisma_client = require
	.resolve('@prisma/client')
	.replace(/@prisma(\/|\\)client(\/|\\)index\.js/, '.prisma/client/index-browser.js')

const prisma_index_browser = path.normalize(path.relative(process.cwd(), prisma_client))

// # Dev
// npm run dev

// # Production
// npm run build
// node server.js

const web_socket = {
	name: 'sveltekit-socket-io',
	// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
	configureServer(server: any): void {
		inject_socket_io(server.httpServer)
	},
}

export default defineConfig({
	plugins: [sveltekit(), web_socket],
	define: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'import.meta.vitest': 'undefined',
	},
	test: {
		include: ['src/**/*.test.ts'],
		hookTimeout: 3000,
		teardownTimeout: 0,
		// coverage: {
		// 	all: true,
		// 	include: ['src/**/*.ts'],
		// 	exclude: ['src/**/+*'],
		// },
	},
	server: {
		host: true,
	},
	// eslint-disable-next-line @typescript-eslint/naming-convention
	resolve: { alias: { '.prisma/client/index-browser': prisma_index_browser } },
})
