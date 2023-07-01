---
title: Concurrency
description: This is a guide to producing readable, reusable, and refactorable software for TypeScript.
---

## Use Promises, not callbacks

```ts::Bad
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

```ts::God
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
