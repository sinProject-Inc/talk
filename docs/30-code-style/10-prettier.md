---
title: Prettier
---

We are automating formatting using [Prettier](https://prettier.io/).

## Configuration

When creating a SvelteKit project, modify the following items in the generated .prettierrc file:

```json
// .prettierrc
{
	"trailingComma": "es5",
	"semi": false
}
```

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.prettierrc)

## Formatting

- Format on Save and Paste events.
- Use Prettier to format TypeScript, JavaScript, HTML, Svelte, and JSON files.

```json
// .vscode/settings.json
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

[Check this file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.vscode/settings.json)
