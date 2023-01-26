import type { Language } from '@prisma/client'
import { Api } from '../api/api'
import { ApiPath } from '../api/api_path'

export class LanguagesApi {
	private readonly _api_path: ApiPath

	public constructor(private readonly _origin = '') {
		this._api_path = ApiPath.api_directory.connect('languages')
	}

	public async fetch(): Promise<Language[]> {
		const api = new Api(this._api_path, this._origin)
		return await api.fetch<Language[]>()
	}
}
