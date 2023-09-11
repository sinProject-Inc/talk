import type { Locale } from '@prisma/client'
import { Api, type Fetch } from '../api/api'
import { ApiPath } from '../api/api_path'

export class LocalesApi {
	private readonly _api_path: ApiPath

	public constructor(private readonly _fetch: Fetch = fetch) {
		this._api_path = ApiPath.api_directory.connect('locales')
	}

	public async fetch(): Promise<Locale[]> {
		const api = new Api(this._api_path, this._fetch)

		return await api.fetch<Locale[]>()
	}
}
