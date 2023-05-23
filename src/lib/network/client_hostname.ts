import * as dns from 'dns'
import * as util from 'util'

export class ClientHostName {
	public constructor(private readonly _client_address: string) {}

	public async reverse(): Promise<string> {
		const reverse_dns = util.promisify(dns.reverse)

		try {
			const hostnames = await reverse_dns(this._client_address)
			return hostnames[0]
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn('Reverse DNS lookup failed.', e)
			return ''
		}
	}
}
