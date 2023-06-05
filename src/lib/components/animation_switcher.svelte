<script lang="ts">
	import { animation_store } from '$lib/view/animation_store'
	import PlayIcon from '$lib/components/icons/play_icon.svelte'
	import PauseIcon from '$lib/components/icons/pause_icon.svelte'
	import type { Unsubscriber } from 'svelte/store'
	import { onMount } from 'svelte'

	let animations_enabled: boolean

	let unsubscribe_to_theme: Unsubscriber

	async function handle_click(): Promise<void> {
		await toggle_animations()
	}

	async function enable(): Promise<void> {
		await animation_store.update_store(true)
		await animation_store.set_local_storage(true)
	}

	async function disable(): Promise<void> {
		await animation_store.update_store(false)
		await animation_store.set_local_storage(false)
	}

	async function toggle_animations(): Promise<void> {
		if (animations_enabled) {
			await disable()
		} else {
			await enable()
		}
	}

	async function subscribe_to_animation_store(): Promise<void> {
		unsubscribe_to_theme = await animation_store.subscribe((value) => {
			animations_enabled = value
		})
	}

	onMount(async () => {
		await subscribe_to_animation_store()
	})
</script>

<button class="glowing-icon" on:click={handle_click}>
	{#if animations_enabled}
		<PlayIcon />
	{:else}
		<PauseIcon />
	{/if}
</button>
