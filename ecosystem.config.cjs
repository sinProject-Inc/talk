// $ pm2 start ecosystem.config.cjs

module.exports = {
	apps: [
		{
			name: 'talk',
			script: './server/index.ts',
			interpreter: 'node',
			interpreterArgs: '--loader tsx',
			instances: '-1',
			exec_mode: 'cluster',
			watch: true,
		},
	],
}
