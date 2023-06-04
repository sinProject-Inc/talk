import { Theme } from '@prisma/client'
import { writable, type Unsubscriber, type Writable } from 'svelte/store'
import { UpdateThemeApi } from './update_theme_api'

export class ThemeService {
	private _ready: Promise<void>
	private _store: Writable<Theme>

	public constructor() {
		this._ready = new Promise<void>(() => {
			return
		})

		this._store = writable(Theme.system)
	}

	public async subscribe(run: (value: Theme) => void): Promise<Unsubscriber> {
		await this._ready

		return this._store.subscribe(run)
	}

	public async update_store(value: Theme): Promise<void> {
		await this._ready

		const theme = value === Theme.system ? this._get_system_theme() : value

		this._store.set(theme)
	}

	public async update_database(value: Theme): Promise<void> {
		await new UpdateThemeApi(value).fetch()
	}

	public async init_store(value: Theme): Promise<void> {
		const theme = value === Theme.system ? this._get_system_theme() : value

		this._store = writable(theme)

		this._ready = Promise.resolve()
	}

	private _get_system_theme(): Theme {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return Theme.dark
		} else {
			return Theme.light
		}
	}

	public get ready(): Promise<void> {
		return this._ready
	}
}

export const theme_service = new ThemeService()
