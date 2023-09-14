import { Api } from '$lib/api/api'
import { ApiPath } from '$lib/api/api_path'
import type { Theme } from '@prisma/client'

export class UpdateThemeApi {
	private readonly _api_path: ApiPath

	public constructor(theme: Theme) {
		this._api_path = ApiPath.api_directory.connect('update-theme').connect(theme)
	}

	public async fetch(): Promise<Theme> {
		const api = new Api(this._api_path)

		return await api.fetch<Theme>()
	}
}
