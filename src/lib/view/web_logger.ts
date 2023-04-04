export enum LogLevel {
	error = 'error',
	warn = 'warn',
	info = 'info',
	debug = 'debug',
}

export class WebLog {
	public constructor(
		public readonly log_level: LogLevel,
		public readonly message: string,
		public readonly user_agent?: string,
		public readonly file_name?: string,
		public readonly line_number?: number,
		public readonly column_number?: number
	) {}
}

export class WebLogger {
	private _send(web_log: WebLog): void {
		fetch('/api/log', {
			method: 'POST',
			headers: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(web_log),
		})
	}

	private _send_message(log_level: LogLevel, message: string): void {
		const web_log = new WebLog(log_level, message)

		this._send(web_log)
	}

	public debug(message: string): void {
		this._send_message(LogLevel.debug, message)
	}

	public info(message: string): void {
		this._send_message(LogLevel.info, message)
	}

	public warn(message: string): void {
		this._send_message(LogLevel.warn, message)
	}
}

export const web_logger = new WebLogger()

// window.addEventListener('error', (event) => {})
//
