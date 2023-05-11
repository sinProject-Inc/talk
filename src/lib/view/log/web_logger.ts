import { FormattedDate } from '$lib/general/formatted_date'
import { WebLog } from './web_log'
import { WebLogLevel } from './web_log_level'

export class WebLogger {
	public constructor(private readonly _page_name: string) {}

	private _save_to_local_storage(web_log: WebLog): void {
		const web_logs = JSON.parse(localStorage.getItem('web_logs') || '[]') as WebLog[]

		web_logs.push(web_log)

		localStorage.setItem('web_logs', JSON.stringify(web_logs))
	}

	private async _send(web_log: WebLog): Promise<void> {
		const response = await fetch('/api/log', {
			method: 'POST',
			headers: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(web_log),
		})

		if (response.status !== 200) {
			this._save_to_local_storage(web_log)

			return
		}

		WebLogger.send_stored_messages(this)
	}

	private _send_message(web_log_level: WebLogLevel, message: string): void {
		const web_log = new WebLog(
			web_log_level,
			`${FormattedDate.japan()} [${this._page_name}] ${message}`
		)

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

	public error(message: string): void {
		this._send_message(WebLogLevel.error, message)
	}

	public static handle_network_change(web_logger: WebLogger): void {
		const online_text = navigator.onLine ? 'online' : 'offline'

		web_logger.warn(`Network changed: ${online_text}, user_agent: ${navigator.userAgent}`)
	}

	public static send_stored_messages(web_logger: WebLogger): void {
		const web_logs = JSON.parse(localStorage.getItem('web_logs') || '[]') as WebLog[]

		web_logs.forEach((web_log) => web_logger._send(web_log))

		localStorage.removeItem('web_logs')

		WebLogger.handle_network_change(web_logger)
	}

	public static handle_error(web_logger: WebLogger, event: ErrorEvent): void {
		const message = `Unhandled Error: ${event.error.message}, stack: ${event.error.stack}, user_agent: ${navigator.userAgent}`
		web_logger.error(message)
	}

	public static handle_unhandled_rejection(
		web_logger: WebLogger,
		event: PromiseRejectionEvent
	): void {
		const message = `Unhanded Rejection: ${event.reason.message}, stack: ${event.reason.stack}, user_agent: ${navigator.userAgent}`
		web_logger.error(message)
	}

	public add_event_listeners(): void {
		// console.debug('[log] add_network_event_listeners')

		window.addEventListener('offline', () => WebLogger.handle_network_change(this))
		window.addEventListener('online', () => WebLogger.send_stored_messages(this))
		window.addEventListener('error', (event) => WebLogger.handle_error(this, event))
		window.addEventListener('unhandledrejection', (event) =>
			WebLogger.handle_unhandled_rejection(this, event)
		)
	}
}

// window.addEventListener('error', (event) => {})
//
