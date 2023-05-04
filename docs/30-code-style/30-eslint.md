---
title: ESLint
---

We are defining code style using [ESLint](https://eslint.org/).

## Rules

- Make accessibility and return type mandatory.
- Prohibit console output.

```js
// .eslintrc.cjs
module.exports = {
	rules: {
		'@typescript-eslint/explicit-member-accessibility': ['error'],
		'@typescript-eslint/explicit-function-return-type': ['error'],
		'no-console': ['error'],
	},
}
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.eslintrc.cjs)

## Naming conventions

- Set variable names, argument names, and function names to snake_case.
- For private cases, add an underscore at the beginning.

```js
// .eslintrc.cjs
module.exports = {
	rules: {
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
}
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.eslintrc.cjs)