import test, { expect } from '@playwright/test'

// API testing
// calendar.google.com/calendar/u/0/r/month?pli=1

const api_path = '/api/log'

test('200', async ({ request }) => {
	const response = await request.post(api_path, {
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'application/json',
		},
		data: {
			level: {
				value: 'info',
			},
			message: 'test',
		},
	})

	expect(response.status()).toBe(200)
})

test('500', async ({ request }) => {
	const response = await request.post(api_path, {
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'application/json',
		},
		data: {
			level: {
				value: 'info2',
			},
			message: 'test',
		},
	})

	expect(response.status()).toBe(404)
})
