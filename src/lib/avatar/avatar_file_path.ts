import { ValidText } from '../text/valid_text'
import { AVATAR_DIR } from '$env/static/private'
import type { UserId } from '../user/user_id'
import slash from 'slash'

export class AvatarFilePath {
	private readonly _path: string

	public constructor(path: string) {
		const valid_text = new ValidText(path)

		this._path = valid_text.text
	}

	public get path(): string {
		return this._path
	}

	public static from_user_id(user_id: UserId): AvatarFilePath {
		const avatar_file_path = new AvatarFilePath(slash(`${AVATAR_DIR}/${user_id.id}.jpg`))

		return avatar_file_path
	}
}
