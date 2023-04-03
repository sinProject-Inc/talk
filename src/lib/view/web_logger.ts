export enum LogType {
	debug = 'DEBUG',
	info = 'INFO',
	warning = 'WARNING',
	error = 'ERROR',
}

export class WebLog {
	public constructor(
		public readonly log_type: LogType,
		public readonly message: string,
		public readonly user_agent?: string,
		public readonly file_name?: string,
		public readonly line_number?: number,
		public readonly column_number?: number
	) {}
}

export class WebLogger {
	private _send(log: WebLog): void {
		fetch('/api/log', {
			method: 'POST',
			headers: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(log),
		})
	}

	private _send_message(log_type: LogType, message: string): void {
		const log = new WebLog(log_type, message)

		this._send(log)
	}

	public debug(message: string): void {
		this._send_message(LogType.debug, message)
	}
}

export const web_logger = new WebLogger()

// window.addEventListener('error', (event) => {})
//
