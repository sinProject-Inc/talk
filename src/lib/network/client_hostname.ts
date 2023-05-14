import dns from 'dns'
import { logger } from '$lib/app/logger'

export class ClientHostName {
	public constructor(private readonly _client_address: string) {}

	public async get_hostname(): Promise<string[]> {
		const hostname: string[] = await new Promise<string[]>((resolve) => {
			dns.reverse(this._client_address, (e, hostnames) => {
				if (e) {
					logger.warn(`${this._client_address} [Network] Could not get hostname`)
					resolve([])
				} else {
					resolve(hostnames)
				}
			})
		})

		return hostname
	}
}
