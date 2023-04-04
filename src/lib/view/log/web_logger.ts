import { WebLog } from './web_log'
import { WebLogLevel } from './web_log_level'

export class WebLogger {
	public constructor(private readonly _page_name: string) {}

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

	private _send_message(web_log_level: WebLogLevel, message: string): void {
		const web_log = new WebLog(web_log_level, `[${this._page_name}] ${message}`)

		this._send(web_log)
	}

	public debug(message: string): void {
		this._send_message(WebLogLevel.debug, message)
	}

	public info(message: string): void {
		this._send_message(WebLogLevel.info, message)
	}

	public warn(message: string): void {
		this._send_message(WebLogLevel.warn, message)
	}
}

// window.addEventListener('error', (event) => {})
//
