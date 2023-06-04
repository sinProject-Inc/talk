<script lang="ts">
	import { browser } from '$app/environment'
	import { onMount, onDestroy } from 'svelte'
	import { theme_store } from '$lib/theme/theme_service'
	import { Theme } from '@prisma/client'

	let dropdown_button_element: HTMLElement
	let dropdown_open = false

	function toggle_dropdown(): void {
		dropdown_open = !dropdown_open
	}

	function close_dropdown(): void {
		dropdown_open = false
	}

	function handle_click(event: MouseEvent): void {
		if (dropdown_open && event.target !== dropdown_button_element) {
			close_dropdown()
		}
	}

	function add_click_listener(): void {
		if (!browser) return

		window.addEventListener('click', handle_click)
	}

	function remove_click_listener(): void {
		if (!browser) return

		window.removeEventListener('click', handle_click)
	}

	function set_to_dark_mode(): void {
		theme_store.set(Theme.dark)
	}

	function set_to_light_mode(): void {
		theme_store.set(Theme.light)
	}

	onMount(() => {
		add_click_listener()
	})

	onDestroy(() => {
		remove_click_listener()
	})

	$: if (!dropdown_open) {
		close_dropdown()
	}
</script>

<div class="relative">
	<button
		bind:this={dropdown_button_element}
		class="rounded bg-white px-4 py-2 text-gray-700 shadow"
		on:click={toggle_dropdown}
	>
		Dropdown
	</button>

	{#if dropdown_open}
		<div class="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-md bg-white shadow-xl">
			<button
				on:click={set_to_dark_mode}
				class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dark Mode</button
			>
			<button
				on:click={set_to_light_mode}
				class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Light Mode</button
			>
		</div>
	{/if}
</div>
