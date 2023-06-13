---
title: Style Guide
description: Some of the code style we use.
---

This doc goes over some of the code style we use.

## Async Code

Prefer writing async code with `try` and `catch` blocks and using `await` over using `.then()` and `.catch()`.

```ts
async function foo(): Promise<void> {
	try {
		await bar()
	} catch (error) {
		console.error(error)
	}
}
```
