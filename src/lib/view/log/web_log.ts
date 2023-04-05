import type { WebLogLevel } from './web_log_level'

export class WebLog {
	public constructor(
		public readonly level: WebLogLevel,
		public readonly message: string,
		public readonly user_agent?: string,
		public readonly file_name?: string,
		public readonly line_number?: number,
		public readonly column_number?: number
	) {}
}
