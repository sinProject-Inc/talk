export class ValidKey {
	private readonly _key: string

	public constructor(key: string) {
		if (!key) throw new Error('Key is required')

		this._key = key
	}

	public get key(): string {
		return this._key
	}
}
