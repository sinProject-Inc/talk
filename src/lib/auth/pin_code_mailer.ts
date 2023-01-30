import * as nodemailer from 'nodemailer';
import { Email } from './email';
import type { MailSubject } from './mail_subject';
import type { PinCode } from './pin_code';

export class PinCodeMailer {
	private readonly _transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 465,
		secure: true,
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS,
		},
	})
	private readonly _from_email = new Email(process.env.GMAIL_USER)

	public constructor(private readonly _to_email: Email, private readonly _mail_subject: MailSubject, private readonly _pin_code: PinCode) {}

	public async send(): Promise<unknown> {
		const html = this._pin_code.get_html()

		return await this._transporter.sendMail({
			from: this._from_email.address,
			to: this._to_email.address,
			subject: this._mail_subject.subject,
			html,
		})
	}
}