import { persisted } from 'svelte-local-storage-store'
import { writable } from 'svelte/store'

export const volume_enabled = persisted('volume_enabled', true)
export const animations_enabled = persisted('animations_enabled', true)
export const theme = persisted('theme', '')

export const mobile_menu_open = writable(false)
