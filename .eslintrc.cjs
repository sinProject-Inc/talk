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
		'padding-line-between-statements': [
			'error',
			{ blankLine: 'always', prev: 'import', next: '*' },
			{ blankLine: 'any', prev: 'import', next: 'import' },
			{ blankLine: 'always', prev: 'export', next: '*' },
			{ blankLine: 'always', prev: '*', next: 'export' },
			{ blankLine: 'any', prev: 'export', next: 'export' },
			{ blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
			{ blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
			{ blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
			{ blankLine: 'always', prev: '*', next: 'return' },
			{ blankLine: 'always', prev: 'multiline-block-like', next: '*' },
			{ blankLine: 'always', prev: '*', next: 'multiline-block-like' },
			{ blankLine: 'always', prev: 'multiline-expression', next: '*' },
			{ blankLine: 'always', prev: '*', next: 'multiline-expression' },
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
			// TODO: 引数、関数、クラス、インターフェイス、enumのメンバー名のルール
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
