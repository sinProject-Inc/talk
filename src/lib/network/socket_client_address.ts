import type { Socket } from 'socket.io'

export class SocketClientAddress {
	public constructor(private readonly _socket: Socket) {}

	public get value(): string {
		const client_address =
			(this._socket.handshake.headers['x-forwarded-for'] as string) ||
			this._socket.handshake.address

		return client_address
	}
}
