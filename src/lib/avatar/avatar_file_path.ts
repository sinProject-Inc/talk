import { ValidText } from '../text/valid_text'
import { AVATAR_DIR } from '$env/static/private'

export class AvatarFilePath {
	private readonly _path: string

	private constructor(path: string) {
		const valid_text = new ValidText(path)

		this._path = valid_text.text
	}

	public get path(): string {
		return this._path
	}

	public static from_user_id(user_id: number): AvatarFilePath {
		const avatar_file_path = new AvatarFilePath(`${AVATAR_DIR}${user_id}`)

		return avatar_file_path
	}
}
