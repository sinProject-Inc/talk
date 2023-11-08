import { ClientHostName } from './client_hostname'
import { describe, expect, test, vi } from 'vitest'

vi.mock('dns', async () => {
	const actual_dns = (await vi.importActual('dns')) as typeof import('dns')

	return {
		...actual_dns,
		promises: {
			reverse: vi.fn((ip) =>
				ip === '8.8.8.8'
					? Promise.resolve(['dns.google'])
					: Promise.reject(new Error('getHostByAddr EINVAL'))
			),
		},
	}
})

describe('ClientHostName', () => {
	test('should return the hostname for a valid IP address', async () => {
		const client_host_name = new ClientHostName('8.8.8.8')
		const hostname = await client_host_name.reverse()
		expect(hostname).toBe('dns.google')
	})

	test('should return an empty string for an invalid IP address', async () => {
		const client_host_name = new ClientHostName('999.999.999.999')

		let hostname

		try {
			hostname = await client_host_name.reverse()
		} catch (error) {
			hostname = ''
		}
		expect(hostname).toBe('')
	})
})
