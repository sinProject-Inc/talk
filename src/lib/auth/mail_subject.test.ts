import { expect, it } from 'vitest'
import { MailSubject } from './mail_subject'

it('[EMPTY]', () => {
	expect(() => {
		new MailSubject('')
	}).toThrow('Mail subject is required')
})

it('Mail subject is too long', () => {
	expect(() => {
		new MailSubject(
			'100 length message 100 length message100 length message100 length message100 length message100 length message'
		)
	}).toThrow('Mail subject is too long')
})

it('normal subject', () => {
	expect(new MailSubject('normal subject').subject).toBe('normal subject')
})
