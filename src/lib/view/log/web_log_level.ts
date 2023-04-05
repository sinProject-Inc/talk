export class WebLogLevel {
	public static readonly error = new WebLogLevel('error')
	public static readonly warn = new WebLogLevel('warn')
	public static readonly info = new WebLogLevel('info')
	public static readonly debug = new WebLogLevel('debug')

	public static readonly values = [
		WebLogLevel.error,
		WebLogLevel.warn,
		WebLogLevel.info,
		WebLogLevel.debug,
	]

	private constructor(public readonly value: string) {}

	public static from(value: string): WebLogLevel {
		const found = WebLogLevel.values.find((log_level) => log_level.value === value)

		if (!found) throw new Error(`Invalid LogLevel: ${value}`)

		return found
	}
}
