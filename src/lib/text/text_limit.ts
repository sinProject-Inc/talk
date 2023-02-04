import { ValidId } from "../general/valid_id"
import { ValidText } from "./valid_text"

export class TextLimit {
	private readonly _text_limit: undefined
	private readonly _limit: number

	public constructor(limit: number) {
		const valid_limit = new ValidId(limit)

		this._limit = valid_limit.id
	}

	public static from_string(limit_string: string | undefined | null): TextLimit {
		const valid_limit = new ValidText(limit_string)
		const id_number = Number(valid_limit.text)
		const text_limit = new TextLimit(id_number)

		return text_limit
	}

	public get limit(): number {
		return this._limit
	}
}