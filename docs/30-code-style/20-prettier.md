---
title: Prettier
---

How we use [Prettier](https://prettier.io/) to automate formatting.

## Configuration

When creating a SvelteKit project, modify the following items in the generated .prettierrc file:

```json:.prettierrc
{
	"trailingComma": "es5",
	"semi": false
}
```

## Formatting

- Enable format on save and paste events.
- Use Prettier to format TypeScript, JavaScript, HTML, Svelte, and JSON files.

```json:.vscode/settings.json
{
	"editor.formatOnSave": true,
	"editor.formatOnPaste": true,
	"[typescript]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"[javascript]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"[html]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"[svelte]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	},
	"[json]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	}
}
```
