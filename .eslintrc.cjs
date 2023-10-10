module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	globals: {
		NodeListOf: false,
	},
	rules: {
		'prettier/prettier': 'error',
		indent: ['error', 'tab', { SwitchCase: 1, ignoredNodes: ['ConditionalExpression'] }],
		semi: ['error', 'never', { beforeStatementContinuationChars: 'never' }],
		'no-unexpected-multiline': 'error',
		'@typescript-eslint/explicit-member-accessibility': ['error'],
		'@typescript-eslint/explicit-function-return-type': ['error'],
		'no-var': 'error',
		'no-console': ['error'],
		// 'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
		'@typescript-eslint/lines-between-class-members': [
			'error',
			'always',
			{ exceptAfterSingleLine: true, exceptAfterOverload: true },
		],
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: '*',
				next: ['export', 'const', 'let', 'return', 'multiline-block-like', 'multiline-expression'],
			},

			{ blankLine: 'any', prev: 'export', next: 'export' },
			{ blankLine: 'any', prev: 'const', next: 'const' },
			{ blankLine: 'any', prev: 'let', next: 'let' },
		],
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
		],
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
		{
			files: '*.cjs',
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/naming-convention': 'off',
			},
		},
	],
}
