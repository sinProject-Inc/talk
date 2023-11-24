import { ClientHostName } from './client_hostname'
import { expect, it, vi } from 'vitest'

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

type Spec = {
	ip: string
	expected: string
}

const specs: Spec[] = [
	{ ip: '8.8.8.8', expected: 'dns.google' },
	{ ip: '999.999.999.999', expected: '' },
]

it.each(specs)('new ClientHostName($ip) -> ($expected)', async (spec: Spec) => {
	const { ip, expected } = spec

	const client_host_name = new ClientHostName(ip)
	const hostname = await client_host_name.reverse()

	expect(hostname).toBe(expected)
})
