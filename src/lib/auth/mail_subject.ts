export class MailSubject {
	private readonly _subject: string

	public constructor(subject: string) {
		if (!subject) throw new Error('Mail subject is required')
		if (subject.length > 100) throw new Error('Mail subject is too long')

		this._subject = subject
	}

	public get subject(): string {
		return this._subject
	}
}