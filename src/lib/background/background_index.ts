export class BackgroundIndex {
	private readonly _index: number

	public constructor(index: number) {
		if (index < 0) throw new Error('id is not positive number')

		this._index = index
	}

	public static from_string(index_string?: string): BackgroundIndex {
		if (!index_string) {
			return new BackgroundIndex(0)
		}

		const index = parseInt(index_string)

		if (isNaN(index)) throw new Error('index is not number')

		return new BackgroundIndex(index)
	}

	public get index(): number {
		return this._index
	}
}
