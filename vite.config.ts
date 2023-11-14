import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import inject_socket_io from './server/socket-handler'

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
		coverage: {
			all: true,
			include: ['src/**/*.ts'],
			exclude: [
				'src/**/+*.ts',
				'src/app.d.ts',
				'src/hooks.server.ts',
				'src/lib/git/create_git_branch.ts',
			],
			reporter: ['lcov', 'text'],
		},
	},
	server: {
		host: true,
	},
	resolve: {
		alias: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
		},
	},
})
