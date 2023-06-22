---
title: Style Guide
description: This doc goes over some of the code style we use.
---

This doc goes over some of the code style we use.

## Async Code

Prefer writing async code with `try` and `catch` blocks and using `await`.

```ts:Good Example
public async get_hostname(): Promise<string> {
	const reverse_dns = util.promisify(dns.reverse)

	try {
		const hostnames = await reverse_dns(this._client_address)
		return hostnames[0]
	} catch (e) {
		console.warn('Reverse DNS lookup failed.', e)
		return ''
	}
}
```

```ts:Bad Example
public async get_hostname(): Promise<string> {
	const hostname: string[] = await new Promise<string[]>((resolve) => {
		dns.reverse(this._client_address, (e, hostnames) => {
			if (e) {
				console.warn('Reverse DNS lookup failed.', e)
				resolve([])
			} else {
				resolve(hostnames[0])
			}
		})
	})

	return hostname
}
```
