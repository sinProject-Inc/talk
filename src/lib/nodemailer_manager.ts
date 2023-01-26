import * as nodemailer from 'nodemailer';
import type { PinCode } from './pin_code';

export class NodemailerManager {
	private readonly _transporter: nodemailer.Transporter

	public constructor() {
		this._transporter = nodemailer.createTransport({
			service: 'gmail',
			port: 465,
			secure: true,
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		})
	}

	public async send_mail(to: string, subject: string, pin_code: PinCode): Promise<unknown> {
		const from = process.env.GMAIL_USER
		const html = pin_code.get_html()
		
		return await this._transporter.sendMail({ from, to, subject, html })
	}
}