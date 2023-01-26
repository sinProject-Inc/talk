import type { Locale } from "@prisma/client"
import { Api } from "../api/api"
import { ApiPath } from "../api/api_path"

export class LocalesApi {
	private readonly _api_path: ApiPath

	public constructor(private readonly _origin = '') {
		this._api_path = ApiPath.api_directory.connect('locales')
	}

	public async fetch(): Promise<Locale[]> {
		const api = new Api(this._api_path, this._origin)
		return await api.fetch<Locale[]>()
	}
}