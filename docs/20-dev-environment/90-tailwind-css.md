---
title: Tailwind CSS
description: For designing user interfaces, we utilize Tailwind CSS.
---

For designing user interfaces, we utilize [Tailwind CSS](https://tailwindcss.com/).

This application's frontend is also built using Tailwind CSS. It allows us to build a custom, utility-first CSS framework that is designed to be highly efficient and productive.

## Tutorial

The Tailwind CSS official website offers a [comprehensive documentation](https://tailwindcss.com/docs) that acts as a tutorial for beginners. To get started with Tailwind CSS, we recommend exploring these documents first.

## Docs

More detailed information can be found in the Docs.

## Config

- By adding the xs breakpoint, we can support devices with smaller screens like the iPhone SE.

```js:tailwind.config.cjs
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			screens: {
				xs: '410px',
			},
		},
	},
}
```

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
