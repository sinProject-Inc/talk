export class Email {
	private readonly _address: string

	public constructor(address: string | undefined) {
		if (!address) throw new Error('Email address is required')

		const pattern =
			/^[a-zA-Z0-9_+-]+(?:\.[a-zA-Z0-9_+-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

		if (!pattern.test(address)) {
			throw new Error('Invalid email address')
		}

		this._address = address
	}

	public get address(): string {
		return this._address
	}
}
