import type { Text } from '@prisma/client'
import { Api } from '../api/api'
import { ApiPath } from '../api/api_path'

export class DeleteTextApi {
	private readonly _api_path: ApiPath

	public constructor(private readonly _text: Text) {
		this._api_path = ApiPath.api_directory.connect('delete-text').connect(this._text.id.toString())
	}

	public async fetch(): Promise<Text> {
		const api = new Api(this._api_path)
		return await api.fetch<Text>()
	}
}
