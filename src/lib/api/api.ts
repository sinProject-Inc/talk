import type { ApiPath } from './api_path'

export class Api {
	public constructor(private readonly _api_path: ApiPath, private readonly _origin = '') {}

	public async fetch<T>(): Promise<T> {
		const url = this._api_path.get_url(this)
		const response = await fetch(url)
		const result = (await response.json()) as T

		return result
	}

	public get origin(): string {
		return this._origin
	}
}
