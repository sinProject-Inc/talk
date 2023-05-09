<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte'
	import SideBar from './side-bar.svelte'
	import SearchModale from './search-modale.svelte'
	import MobileSideBar from './mobile-side-bar.svelte'
	import NavbarSecondRow from './navbar-second-row.svelte'
	import { afterNavigate } from '$app/navigation'
	import { onMount } from 'svelte'
	import { KeyboardShortcutHandler } from '$lib/view/keyboard_shortcut_handler'

	let search_modale_open = false
	let mobile_side_bar_open = false

	export let data

	$: sections = data?.sections ?? []

	function open_search_modale(): void {
		search_modale_open = true
	}

	function close_search_modale(): void {
		search_modale_open = false
	}

	function open_mobile_side_bar(): void {
		mobile_side_bar_open = true
	}

	function close_mobile_side_bar(): void {
		mobile_side_bar_open = false
	}

	function create_search_shortcut(): void {
		const search_shortcut_params = {
			control: true,
			code: 'KeyK',
		}

		new KeyboardShortcutHandler(search_shortcut_params, handle_search_shortcut)
	}

	function handle_search_shortcut(): void {
		if (search_modale_open) {
			close_search_modale()

			return
		}

		open_search_modale()
	}

	afterNavigate(() => {
		close_mobile_side_bar()
	})

	onMount(() => {
		create_search_shortcut()
	})
</script>

<div class="doc-base">
	<Navbar search_bar_enabled on:show_search_modale={open_search_modale} />
	<NavbarSecondRow on:open_mobile_side_bar={open_mobile_side_bar} />

	{#if mobile_side_bar_open}
		<MobileSideBar {sections} on:close={close_mobile_side_bar} />
	{/if}

	{#if search_modale_open}
		<SearchModale on:close={close_search_modale} />
	{/if}

	<div class="max-w-8xl min-h-screen mx-auto">
		<div
			class="md:w-72 ps-8 pe-4 pb-[calc(2rem+var(--header-height))] h-screen fixed overflow-y-auto hidden md:block"
		>
			<SideBar {sections} on:show_search_modale={open_search_modale} />
		</div>
		<div class="ps-12 pe-8 md:ps-80 py-8 xl:pe-80">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss">
	:root {
		background: black;
	}
</style>
