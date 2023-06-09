import { persisted } from 'svelte-local-storage-store'

export const volume_enabled = persisted('volume_enabled', true)
export const animations_enabled = persisted('animations_enabled', true)
export const theme = persisted('theme', '')
