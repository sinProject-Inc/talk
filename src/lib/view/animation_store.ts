import { browser } from '$app/environment'
import { writable, type Unsubscriber, type Writable } from 'svelte/store'

export class AnimationStore {
	private _enabled: Writable<boolean>
	private _default_value = true

	public constructor() {
		if (!browser) {
			this._enabled = writable(this._default_value)

			return
		}

		const local_storage_value = this.get_from_local_storage()

		if (local_storage_value === null) {
			this.set_local_storage(true)
			this._enabled = writable(true)
		} else {
			this._enabled = writable(local_storage_value)
		}
	}

	public async subscribe(run: (value: boolean) => void): Promise<Unsubscriber> {
		return this._enabled.subscribe(run)
	}

	public async update_store(value: boolean): Promise<void> {
		this._enabled.set(value)
		this.set_local_storage(value)
	}

	public get_from_local_storage(): boolean {
		const item = localStorage.getItem('animation_enabled')

		if (item) {
			return JSON.parse(item)
		}

		return this._default_value
	}

	public async set_local_storage(value: boolean): Promise<void> {
		localStorage.setItem('animation_enabled', JSON.stringify(value))
	}
}

export const animation_store = new AnimationStore()
