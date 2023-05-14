import { Api } from '$lib/api/api'
import { ApiPath } from '$lib/api/api_path'
import type { Avatar } from './avatar'

export class GetAvatarApi {
	private readonly _api_path: ApiPath

	public constructor(private readonly _user_id: string) {
		this._api_path = ApiPath.api_directory.connect('get-avatar').connect(this._user_id)
	}

	public async fetch(): Promise<Avatar> {
		const api = new Api(this._api_path)
		return await api.fetch<Avatar>()
	}
}
