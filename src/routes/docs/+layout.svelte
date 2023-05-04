<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte'
	import SideBar from './side-bar.svelte'
	import { page } from '$app/stores'
	import { fly } from 'svelte/transition'

	export let data

	$: pathname = $page.url.pathname
	$: sections = data?.sections ?? []
</script>

<div class="doc-base">
	<Navbar />

	<div class="max-w-8xl min-h-screen mx-auto">
		<div
			class="md:w-72 ps-8 pe-4 pb-[calc(2rem+var(--header-height))] h-screen fixed overflow-y-auto hidden md:block"
		>
			<SideBar {sections} />
		</div>
		<div class="ps-12 pe-8 md:ps-80 py-8 xl:pe-80">
			{#key pathname}
				<div in:fly={{ y: 5, duration: 600 }}>
					<slot />
				</div>
			{/key}
		</div>
	</div>
</div>

<style lang="postcss">
	:root {
		background: black;
	}
</style>
