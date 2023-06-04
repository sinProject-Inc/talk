import { Theme } from '@prisma/client'
import { writable, type Unsubscriber, type Writable } from 'svelte/store'
import { GetThemeApi } from './get_theme_api'
import { browser } from '$app/environment'
import { UpdateThemeApi } from './update_theme_api'

export class ThemeService {
	private _store: Writable<Theme>

	public constructor(theme: Theme) {
		this._store = writable(theme)
	}

	public subscribe(run: (value: Theme) => void): Unsubscriber {
		return this._store.subscribe(run)
	}

	public static async from_database(): Promise<Theme> {
		const theme = await new GetThemeApi().fetch()

		return theme
	}

	public async set(value: Theme): Promise<void> {
		this._store.set(value)
		await new UpdateThemeApi(value).fetch()
	}

	// public toggle(): void {
	// 	this._store.update((current) => {
	// 		const new_value = current === 'light' ? 'dark' : 'light'
	// 		// set db
	// 		return new_value
	// 	})
	// }
}

export const theme_store = new ThemeService(Theme.dark)
