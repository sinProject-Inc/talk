import type { Text } from "@prisma/client"
import { Api } from "../api/api"
import { ApiPath } from "../api/api_path"

export class DeleteTextApi {
	private readonly _api_path: ApiPath

	public constructor(text: Text, private readonly _origin = '') {
		this._api_path = ApiPath.api_directory
			.connect('delete-text')
      .connect(text.id.toString())
	}

	public async fetch(): Promise<Text> {
		const api = new Api(this._api_path, this._origin)
		return await api.fetch<Text>()
	}
}