<script lang="ts">
	import { browser } from '$app/environment'
	import { onMount, onDestroy } from 'svelte'

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
			<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> Link #1 </a>
			<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> Link #2 </a>
		</div>
	{/if}
</div>
