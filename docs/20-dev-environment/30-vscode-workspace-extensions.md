---
title: VSCode Workspace Extensions
description: Here are the VSCode extensions that we commonly use at sinProject.
---

Here are the VSCode extensions that we commonly use at sinProject.

[View our extension setting file on GitHub >](https://github.com/sinProject-Inc/talk/blob/main/.vscode/extensions.json)

## Git

- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)

View a Git Graph of your repository, and perform Git actions from the graph.

- [GitHub Pull Request and Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)

Pull Request and Issue Provider for GitHub

- [GitHub Actions](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions)

GitHub Actions workflows and runs for github.com hosted repositories in VSCode

## AI

- [ChatGPT - Genie AI](https://marketplace.visualstudio.com/items?itemName=genieai.chatgpt-vscode)

Your best AI pair programmer. Save conversations and continue any time. A Visual Studio Code - ChatGPT Integration. Supports GPT-4, GPT3.5, GPT3 and Codex models. Create new files, view diffs with one click; your copilot to learn code, add tests, find bugs and more.

- [Tabnine AI Autocomplete for Javascript, Python, Typescript, PHP, Go, Java, Ruby & more](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)

JavaScript, Python, Java, Typescript & all other languages - AI Code completion plugin. Tabnine makes developers more productive by auto-completing their code.

## Svelte

- [Svelte for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

Svelte language support for VSCode

- [Svelte 3 snippets](https://marketplace.visualstudio.com/items?itemName=fivethree.vscode-svelte-snippets)

Svelte 3 Snippets for VSCode

## CSS

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

Intelligent Tailwind CSS tooling for VSCode

- [CSS Peek](https://marketplace.visualstudio.com/items?itemName=pranaygp.vscode-css-peek)

Allow peeking to css ID and class strings as definitions from html files to respective CSS. Allows peek and goto definition.

- [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight)

Highlight web colors in your editor

## HTML

- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

Auto rename paired HTML/XML tag

- [Highlight Matching Tag](https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag)

Highlights matching closing and opening tags

- [HTML Preview](https://marketplace.visualstudio.com/items?itemName=george-alisson.html-preview-vscode)

Provides ability to preview HTML documents.

## Code Style

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Integrates ESLint JavaScript into VSCode.

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Code formatter using prettier

- [Trailing Spaces](https://marketplace.visualstudio.com/items?itemName=shardulm94.trailing-spaces)

Highlight trailing spaces and delete them in a flash!

- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

Spelling checker for source code

```json:.vscode/settings.json
{
	"cSpell.words": [
		"autocompletes",
		"autoincrement",
		"codegen",
		...
	],
	"cSpell.ignorePaths": [
		"**/settings.json",
		"**/extensions.json",
		"**/package.json",
		"**/package-lock.json",
		"**/yarn.lock",
		"**/locales/**.json"
	]
}
```

- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

Official Stylelint extension for Visual Studio Code

## Intellisense

- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

Visual Studio Code plugin that autocompletes filenames

## Errors

- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

Improve highlighting of errors, warnings and other language diagnostics.

- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)

Make TypeScript errors prettier and more human-readable in VSCode

- [Error Gutters](https://marketplace.visualstudio.com/items?itemName=IgorSbitnev.error-gutters)

Show error gutters to the right from line numbers

## Testing

- [Vitest](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)

Run and debug Vitest test cases

```json:.vscode/settings.json
{
	"vitest.include": ["src/**/*.{test}.ts"]
}
```

- [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

Run Playwright Test tests in Visual Studio Code.

## Database Management

- [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

Adds syntax highlighting, formatting, auto-completion, jump-to-definition and linting for .prisma files.

## Networking

- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

REST Client for Visual Studio Code

```json:.vscode/settings.json
{
	"rest-client.previewResponseInUntitledDocument": true
}
```

- [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)

Open any folder on a remote machine using SSH and take advantage of VS Code's full feature set.

## Code Execution

- [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)

Run C, C++, Java, JS, PHP, Python, Perl, Ruby, Go, Lua, Groovy, PowerShell, CMD, BASH, F#, C#, VBScript, TypeScript, CoffeeScript, Scala, Swift, Julia, Crystal, OCaml, R, AppleScript, Elixir, VB.NET, Clojure, Haxe, Obj-C, Rust, Racket, Scheme, AutoHotkey, AutoIt, Kotlin, Dart, Pascal, Haskell, Nim,

```json:.vscode/settings.json
{
	"code-runner.executorMap": {
		"typescript": "npx tsx"
	}
}
```

- [Turbo Console Log](https://marketplace.visualstudio.com/items?itemName=ChakrounAnas.turbo-console-log)

Automating the process of writing meaningful log messages.

## Code Quality

- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

Display import/require package size in the editor

## Theme

- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)

Material Design Icons for Visual Studio Code

## Team Collaboration

- [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)

Real-time collaborative development from the comfort of your favorite tools.

## Localization

- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)

🌍 All in one i18n extension for VSCode

```json:.vscode/settings.json
{
	"i18n-ally.localesPaths": ["src/locales", "src/routes/api/languages", "src/routes/api/locales"],
	"i18n-ally.keystyle": "nested",
	"i18n-ally.displayLanguage": "en-US",
	"i18n-ally.sourceLanguage": "en-US"
}
```

## Other

- [ToDo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)

Show TODO, FIXME, etc. comment tags in a tree view

- [Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks)

Mark lines and jump to them

- [PostCSS Language Support](https://marketplace.visualstudio.com/items?itemName=csstools.postcss)

Syntax highlighting for modern and experimental CSS in VSCode
