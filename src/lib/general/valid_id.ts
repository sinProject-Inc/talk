export class ValidId {
	private readonly _id: number

	public constructor(id: number) {
		if (isNaN(id)) throw new Error('id is not number')
		if (id <= 0) throw new Error('id is not positive number')

		this._id = id
	}

	public get id(): number {
		return this._id
	}
}
