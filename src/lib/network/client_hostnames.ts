import dns from 'dns'

export class ClientHostName {
	public constructor(private readonly _client_address: string) {}

	public async get_hostname(): Promise<string[]> {
		const hostname: string[] = await new Promise<string[]>((resolve, reject) => {
			dns.reverse(this._client_address, (err, hostnames) => {
				if (err) {
					reject(err)
				} else {
					resolve(hostnames)
				}
			})
		})

		const client_hostname = hostname

		return client_hostname
	}
}
