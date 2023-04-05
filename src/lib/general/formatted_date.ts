export class FormattedDate {
	public static japan(date: Date = new Date()): string {
		const locale = 'ja-JP'
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		}

		const formatted_date = date.toLocaleString(locale, options)

		return formatted_date.replace(/\//g, '-')
	}
}
