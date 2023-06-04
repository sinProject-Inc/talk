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

		this._store = writable(Theme.dark)
	}

	public async subscribe(run: (value: Theme) => void): Promise<Unsubscriber> {
		await this._ready

		return this._store.subscribe(run)
	}

	public async update_store(value: Theme): Promise<void> {
		await this._ready

		this._store.set(value)
	}

	public async update_database(value: Theme): Promise<void> {
		await new UpdateThemeApi(value).fetch()
	}

	public async init_store(theme: Theme): Promise<void> {
		this._store = writable(theme)

		this._ready = Promise.resolve()
	}

	public get ready(): Promise<void> {
		return this._ready
	}
}

export const theme_service = new ThemeService()
