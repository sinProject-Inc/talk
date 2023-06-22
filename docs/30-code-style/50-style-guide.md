---
title: Style Guide
description: This doc goes over some of the code style we use.
---

This doc goes over some of the code style we use.

## Async Code

Prefer writing async code with `try` and `catch` blocks and using `await`.

```ts:Good Example
async function foo(): Promise<void> {
	try {
		await bar()
	} catch (e) {
		console.error(e)
	}
}
```

```ts:Bad Example
async function foo(): Promise<void> {
	await new Promise<string[]>((resolve) => {
		bar((e, data) => {
			if (e) {
				console.error(e)
				resolve([])
			} else {
				resolve(data)
			}
		})
	})
}
```
