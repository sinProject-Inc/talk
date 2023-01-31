export class PinCode {
	private readonly _pin_code: undefined
	private readonly _code: string

	public constructor(code: string | undefined) {
		if (!code) throw new Error('Code is required')
		if (code.length < 6) throw new Error('Code is too short')

		this._code = code
	}

	public get code(): string {
		return this._code
	}

	public static generate(length = 6): PinCode {
		const pin_code_chars = '0123456789'

		let code = ''

		while (code.length < length) {
			code += pin_code_chars[Math.floor(Math.random() * pin_code_chars.length)]
		}

		const pin_code = new PinCode(code)

		return pin_code
	}

	public get_html(): string {
		const html = `
		<html>
			<body>
				<div style="margin-left: auto;margin-right: auto;width: 100%;max-width: 500px;font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;">
					<h1 style="margin-top: 2.5rem;margin-bottom: 0.5rem;font-size: 2rem;line-height: 2.25rem;font-weight: 800;">sinProject Talk</h1>
					<h2 style="margin-top: 2.5rem;margin-bottom: 0.5rem;font-size: 1.875rem;line-height: 2.25rem;font-weight: 600;">Sign in with code</h2>
					<p style="margin-bottom: 1.25rem;font-size: 1.25rem;line-height: 1.75rem;">Enter the following code into the app to sign in.</p>
					<p style="width: 100%;background-color: #F3F4F6;padding-top: 30px;padding-bottom: 30px;text-align: center;font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, &quot;Liberation Mono&quot;, &quot;Courier New&quot;, monospace;font-size: 1.875rem;line-height: 2.25rem; margin-bottom: 3rem;">
						${this._code}
					</p>
					<p style="margin-bottom: 1.25rem;font-size: 1.05rem;line-height: 1.75rem;">If you didn’t request this email, you can safely ignore it.</p>
		
				</div>
			</body>
		</html>`

		return html
	}
}
