import { ValidText } from "../valid_text"

export class SoundFilePath {
	private readonly _sound_file_path: undefined
	private readonly _path: string

	public constructor(path: string) {
		const valid_text = new ValidText(path)

		this._path = valid_text.text
	}

	public get path(): string {
		return this._path
	}
}
