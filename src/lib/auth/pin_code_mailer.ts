import { GMAIL_PASS, GMAIL_USER } from '$env/static/private'
import { App } from '$lib/app/app'
import * as nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import { Email } from './email'
import type { MailSubject } from './mail_subject'
import type { PinCode } from './pin_code'

export class PinCodeMailer {
	private readonly _transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 465,
		secure: true,
		auth: {
			user: GMAIL_USER,
			pass: GMAIL_PASS,
		},
	})

	private readonly _from_email = new Email(GMAIL_USER)

	public constructor(
		private readonly _to_email: Email,
		private readonly _mail_subject: MailSubject,
		private readonly _pin_code: PinCode
	) {}

	private get _from(): string {
		return `${App.app_name} <${this._from_email.address}>`
	}

	public async send(): Promise<SMTPTransport.SentMessageInfo> {
		const html = this._pin_code.get_html()

		return await this._transporter.sendMail({
			from: this._from,
			to: this._to_email.address,
			subject: this._mail_subject.subject,
			html,
		})
	}
}
