// import { expect } from '@playwright/test'
import * as imaps from 'imap-simple'

export async function get_pin_code_from_mail(): Promise<string> {
	const gmail_user = process.env['GMAIL_USER'] ?? ''
	const gmail_password = process.env['GMAIL_PASS'] ?? ''

	// expect(gmail_user).toBeDefined()
	// expect(gmail_password).toBeDefined()

	const config = {
		imap: {
			user: gmail_user,
			password: gmail_password,
			host: 'imap.gmail.com',
			port: 993,
			tls: true,
			authTimeout: 3000,
			tlsOptions: { servername: 'imap.gmail.com' },
		},
	}

	const connection = await imaps.connect(config)

	await connection.openBox('INBOX')

	const search_criteria = ['UNSEEN', ['HEADER', 'SUBJECT', '% is your PIN code']]
	const fetch_options = {
		bodies: ['HEADER', 'TEXT'],
		markSeen: false,
	}
	const messages = await connection.search(search_criteria, fetch_options)

	const subjects: string[] = messages.map((message) => {
		const header_part = message.parts.find((part) => part.which === 'HEADER')

		if (header_part && header_part.body.subject) {
			return header_part.body.subject[0]
		}

		return ''
	})

	// expect(subjects.length).toBeGreaterThan(0)

	const latest_subject = subjects[subjects.length - 1]

	if (!latest_subject) return ''

	const pin_code = latest_subject.split(' ')[0]

	if (!pin_code) return ''

	return pin_code
}
