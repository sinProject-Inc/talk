export class Urlify {
	public constructor(private readonly _text: string) {}

	private _escape_html(): string {
		const escaped_text = this._text.replace(/[&<>"']/g, (char) => {
			switch (char) {
				case '&':
					return '&amp;'
				case '<':
					return '&lt;'
				case '>':
					return '&gt;'
				case '"':
					return '&quot;'
				case "'":
					return '&#039;'
				default:
					return char
			}
		})

		return escaped_text
	}

	public replace(): string {
		const escaped_text = this._escape_html()
		const url_regex = /(?:https?:\/\/|www\.)[^\s]+/gi

		return escaped_text.replace(url_regex, (url) => {
			let new_url = url

			if (!url.startsWith('http') && !url.startsWith('https')) {
				if (url.includes('www.')) {
					new_url = `https://${url}`
				} else {
					new_url = `https://www.${url}`
				}
			}

			console.log('new_url', new_url)
			console.log('url', url)

			return `<a href="${new_url}" target="_blank" rel="noopener noreferrer">${url}</a>`
		})
	}
}
