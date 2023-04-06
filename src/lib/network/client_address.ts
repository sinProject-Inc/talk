export class ClientAddress {
	public constructor(
		private readonly _request: Request,
		private readonly _get_client_address: () => string
	) {}

	public get value(): string {
		const client_address =
			this._request.headers.get('x-forwarded-for') || this._get_client_address()

		return client_address
	}
}
