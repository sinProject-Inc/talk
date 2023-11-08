import { ClientHostName } from './client_hostname'
import { expect, test, describe } from 'vitest'

describe('ClientHostName', () => {
	test('should return the hostname for a valid IP address', async () => {
		const client_host_name = new ClientHostName('8.8.8.8')
		const hostname = await client_host_name.reverse()

		expect(hostname).toBe('dns.google')
	})

	test('should return an empty string for an invalid IP address', async () => {
		const client_host_name = new ClientHostName('999.999.999.999')
		const hostname = await client_host_name.reverse()

		expect(hostname).toBe('')
	})
})
