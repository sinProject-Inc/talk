<script lang="ts">
	import { theme_service } from '$lib/theme/theme_service'
	import { Theme } from '@prisma/client'
	import SunIcon from './icons/sun_icon.svelte'
	import MoonIcon from './icons/moon_icon.svelte'
	import type { Unsubscriber } from 'svelte/store'
	import { onMount } from 'svelte'

	let current_theme: Theme

	let unsubscribe_to_theme: Unsubscriber

	async function handle_click(): Promise<void> {
		await toggle_theme()
	}

	async function set_to_dark_mode(): Promise<void> {
		await theme_service.update_store(Theme.dark)
		await theme_service.update_database(Theme.dark)
	}

	async function set_to_light_mode(): Promise<void> {
		await theme_service.update_store(Theme.light)
		await theme_service.update_database(Theme.light)
	}

	async function toggle_theme(): Promise<void> {
		if (current_theme === Theme.dark) {
			await set_to_light_mode()
		} else if (current_theme === Theme.light) {
			await set_to_dark_mode()
		}
	}

	async function subscribe_to_theme(): Promise<void> {
		unsubscribe_to_theme = await theme_service.subscribe((theme) => {
			current_theme = theme
		})
	}

	onMount(async () => {
		await subscribe_to_theme()
	})
</script>

{#await theme_service.ready then}
	<button class="button flex h-5 p-0 no-underline" on:click={handle_click}>
		{#if current_theme === Theme.light}
			<SunIcon />
		{:else if current_theme === Theme.dark}
			<MoonIcon />
		{/if}
	</button>
{/await}
