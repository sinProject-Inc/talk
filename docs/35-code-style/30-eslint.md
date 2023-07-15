---
title: ESLint
description: How we define code style using ESLint.
---

How we define code style using [ESLint](https://eslint.org/).

## Rules

- Make accessibility and return type mandatory.
- Prohibit console output.

```js:.eslintrc.cjs
module.exports = {
	rules: {
		semi: ['error', 'never', { beforeStatementContinuationChars: 'never' }],
		'no-unexpected-multiline': 'error',
		'@typescript-eslint/explicit-member-accessibility': ['error'],
		'@typescript-eslint/explicit-function-return-type': ['error'],
		'no-console': ['error'],
	},
}
```

[typescript-eslint - explicit-member-accessibility >](https://typescript-eslint.io/rules/explicit-member-accessibility/)

[typescript-eslint - explicit-function-return-type >](https://typescript-eslint.io/rules/explicit-function-return-type/)

[ESLint - no-console >](https://eslint.org/docs/latest/rules/no-console)

## Naming conventions

[Enforce naming conventions for everything across a codebase.](https://typescript-eslint.io/rules/naming-convention/)

- Define variable names, argument names, and function names with snake_case.
- Prefix private variables with an underscore.

```js:.eslintrc.cjs
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

## Missing return type on function in the HTML part of Svelte

In the HTML part of Svelte, if "Missing return type on function" is displayed, add an eslint-disable line at the bottom of the script block.

```ts
<script lang="ts">
	...

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<button on:click={() => on_click_button(text)} />
```
