export class IPAddress {
	private readonly _address: string

	public constructor(address: string | undefined) {
		if (!address) throw new Error('IP address is required')

		this._address = address
	}

	public get address(): string {
		return this._address
	}
}
