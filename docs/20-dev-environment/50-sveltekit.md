---
title: SvelteKit
description: For web application development, we utilize SvelteKit.
---

For web application development, we utilize [SvelteKit](https://kit.svelte.dev/).

This documentation app is also built using SvelteKit and TypeScript. On the server side, it examines the folder structure to generate menu data, retrieves markdown files, and applies styles using CSS within the browser.

## Tutorial

The SvelteKit official website offers an [interactive tutorial](https://learn.svelte.dev/tutorial/welcome-to-svelte) for beginners. To get started with Svelte and SvelteKit, we recommend exploring these tutorials first.

## Docs

More detailed information can be found in the Docs.

- [Svelte Docs](https://svelte.dev/docs)
- [SvelteKit Docs](https://kit.svelte.dev/docs/introduction)

## Creating a Project

```shell
$ npm create svelte@latest my-app
create-svelte version 5.0.2
┌ Welcome to SvelteKit!
◆ Which Svelte app template?
│ ○ SvelteKit demo app (A demo app showcasing some of the features of SvelteKit - play a word guessing game that works without JavaScript!)
│ ● Skeleton project
│ ○ Library project

◆ Add type checking with TypeScript?
│ ○ Yes, using JavaScript with JSDoc comments
│ ● Yes, using TypeScript syntax
│ ○ No

◆ Select additional options (use arrow keys/space bar)
│ ☑ Add ESLint for code linting
│ ☑ Add Prettier for code formatting
│ ☑ Add Playwright for browser testing
│ ☑ Add Vitest for unit testing

$ cd my-app
$ npm install
$ npm run dev
```
