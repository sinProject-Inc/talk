<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte'
	import SideBar from './side-bar.svelte'
	import SearchModale from './search_modale.svelte'

	let search_modale_open = false

	export let data

	$: sections = data?.sections ?? []

	function open_search_modale(): void {
		search_modale_open = true
	}

	function close_search_modale(): void {
		search_modale_open = false
	}
</script>

<div class="doc-base">
	{#if search_modale_open}
		<SearchModale on:close={close_search_modale} />
	{/if}
	<Navbar />

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
