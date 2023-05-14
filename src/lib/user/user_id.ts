import { ValidId } from '../general/valid_id'

export class UserId {
	private readonly _id: number

	public constructor(id: number) {
		const valid_id = new ValidId(id)

		this._id = valid_id.id
	}

	public static from_string(id_string: string | undefined): UserId {
		if (!id_string) throw new Error('id_string is empty')

		const id_number = Number(id_string)
		const user_id = new UserId(id_number)

		return user_id
	}

	public get id(): number {
		return this._id
	}
}
