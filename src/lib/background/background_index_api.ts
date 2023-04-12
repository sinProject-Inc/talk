import { BackgroundIndex } from './background_index'
import { Api, type Fetch } from '../api/api'
import { ApiPath } from '../api/api_path'

export class BackgroundIndexApi {
	private readonly _api_path: ApiPath

	public constructor(
		private readonly _background_index: BackgroundIndex,
		private readonly _fetch: Fetch
	) {
		const index_string = this._background_index.index.toString()

		this._api_path = ApiPath.api_directory.connect('background-index').connect(index_string)
	}

	public async fetch(): Promise<BackgroundIndex> {
		const api = new Api(this._api_path, this._fetch)
		const result = await api.fetch<number>()
		const background_index = new BackgroundIndex(result)

		return background_index
	}
}
