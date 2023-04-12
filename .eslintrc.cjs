module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript'),
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	rules: {
		'@typescript-eslint/explicit-member-accessibility': ['error'],
		'@typescript-eslint/explicit-function-return-type': ['warn'],
		'no-console': ['warn'],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'typeParameter',
				format: ['UPPER_CASE'],
			},
			{
				selector: ['class', 'interface', 'typeAlias'],
				format: ['PascalCase'],
			},
			{
				selector: ['method', 'function'],
				modifiers: ['private'],
				format: ['snake_case'],
				leadingUnderscore: 'require',
			},
			{
				selector: ['method', 'function'],
				modifiers: ['protected'],
				format: ['snake_case'],
				leadingUnderscore: 'require',
			},
			{
				selector: ['method', 'function'],
				format: ['snake_case'],
				// format: ['snake_case', 'camelCase'],
			},
			{
				selector: [
					'property',
					'accessor',
					'parameter',
					'parameterProperty',
					'variable',
					'enumMember',
				],
				modifiers: ['private'],
				format: ['snake_case'],
				leadingUnderscore: 'require',
			},
			{
				selector: [
					'property',
					'accessor',
					'parameter',
					'parameterProperty',
					'variable',
					'enumMember',
				],
				modifiers: ['protected'],
				format: ['snake_case'],
				leadingUnderscore: 'require',
			},
			{
				selector: ['accessor', 'parameter', 'parameterProperty', 'enumMember'],
				format: ['snake_case'],
			},
			{
				selector: ['property'],
				format: ['snake_case', 'camelCase'],
			},
			{
				selector: ['variable'],
				format: ['snake_case', 'UPPER_CASE'],
			},
			// TODO: 引数、関数、クラス、インターフェイス、enumのメンバー名のルール
		],
	},
}
