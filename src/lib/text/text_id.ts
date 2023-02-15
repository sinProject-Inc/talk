import { ValidText } from './valid_text'
import { ValidId } from '../general/valid_id'

export class TextId {
	private readonly _id: number

	public constructor(id: number) {
		const valid_id = new ValidId(id)

		this._id = valid_id.id
	}

	public static from_string(id_string: string | undefined): TextId {
		const valid_text = new ValidText(id_string)
		const id_number = Number(valid_text.text)
		const text_id = new TextId(id_number)

		return text_id
	}

	public get id(): number {
		return this._id
	}
}
