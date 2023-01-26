import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { get_html } from './mail_template'; 

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

	public async send_mail(to: string, subject: string, pin_code: string): Promise<unknown> {
		const from = process.env.GMAIL_USER
		const html = get_html(pin_code)
		
		return await this._transporter.sendMail({ from, to, subject, html })
	}
}