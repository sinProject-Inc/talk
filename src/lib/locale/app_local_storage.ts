export class AppLocalStorage {
	private constructor() {
		// DO NOTHING
	}

	public static readonly instance = new AppLocalStorage()

	public get to_locale(): string {
		return localStorage.getItem('to_locale') ?? 'en-US'
	}

	public set to_locale(value: string) {
		localStorage.setItem('to_locale', value)
	}

	public get name(): string {
		return localStorage.getItem('name') ?? ''
	}

	public set name(value: string) {
		localStorage.setItem('name', value)
	}
}
