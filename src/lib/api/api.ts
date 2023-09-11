import type { ApiPath } from './api_path'

export type Fetch = (url: string, init?: RequestInit) => Promise<Response>

export class Api {
	public constructor(
		private readonly _api_path: ApiPath,
		private readonly _fetch: Fetch = fetch
	) {}

	public async fetch<T>(): Promise<T> {
		const url = this._api_path.path()
		const response = await this._fetch(url)

		const result = (await response.json()) as T

		return result
	}
}
