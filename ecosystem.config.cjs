module.exports = {
	apps: [
		{
			name: 'sinpro-template-talk',
			script: 'build',
			interpreter: 'node',
			interpreterArgs: '--loader tsx',
			instances: '-1',
			exec_mode: 'cluster',
			watch: false,
			ignore_watch: ['logs'],
			env: {
				PORT: 3005,
			},
		},
	],
}
