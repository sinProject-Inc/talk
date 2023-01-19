import { ValidId } from "../../general/valid_id"

export class SoundId {
	private readonly _sound_id: undefined
	private readonly _id: number

	public constructor(id: number) {
		const valid_id = new ValidId(id)

		this._id = valid_id.id
	}

	public get id(): number {
		return this._id
	}
}