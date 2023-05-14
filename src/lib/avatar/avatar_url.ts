import type { UserId } from '../user/user_id'
import { ApiPath } from '../api/api_path'

export class AvatarUrl {
	public constructor(
		// TODO: Value Object
		private readonly _user_id: UserId
	) {}

	public get url(): string {
		try {
			const api_path = ApiPath.api_directory.connect('avatar').connect(this._user_id.id.toString())
			return api_path.path()
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
			return ''
		}
	}
}
