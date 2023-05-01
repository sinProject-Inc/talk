<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	import Fuse from 'fuse.js'
	import search_index from '$lib/assets/search_index.json'
	import SearchIcon from '$lib/components/icons/search_icon.svelte'

	let query: string
	let results: Fuse.FuseResult<{
		path: string
		title: string
		content: string
		description?: never
	}>[] = []

	const fuse = new Fuse(search_index, {
		keys: ['title', 'description', 'content'],
		threshold: 0.4,
		includeScore: true,
		includeMatches: true,
	})

	function search(): void {
		if (!query) results = []

		results = fuse.search(query)

		// console.log(results)
		// results.forEach((result) => {
		// 	console.log('found!', result.item.path, result.item.title)
		// })
	}

	const dispatch = createEventDispatcher()

	function close(): void {
		//release_scroll()
		dispatch('close')
	}

	function handle_keydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			close()
			return
		}
	}

	// function handle_scroll(event: WheelEvent): void {
	// 	event.preventDefault()
	// }

	// function release_scroll(): void {
	// 	document.removeEventListener('wheel', handle_scroll)
	// }

	// onMount(() => {
	// 	document.addEventListener('wheel', handle_scroll, { passive: false })
	// })

	function handle_scroll(event: WheelEvent): void {
		event.preventDefault()
	}
</script>

<svelte:window on:keydown={handle_keydown} />

<div class="fixed top-0 left-0 w-screen h-screen pointer-events-auto z-10" on:click={close} />

<div
	class="fixed top-0 left-0 w-full h-full justify-center flex pointer-events-none px-4 z-20 backdrop-blur-sm py-20"
>
	<div
		class="rounded-xl glass-panel bg-slate-800/90 backdrop-blur-md pointer-events-auto text-center mx-auto max-w-screen-md w-full h-fit max-h-[calc(75vh)] flex flex-col"
	>
		<form class="px-4 py-3" on:submit|preventDefault={search}>
			<div class="flex">
				<label class="w-7" for="search"><SearchIcon /></label>
				<input
					class="w-full pl-4 text-xl bg-inherit"
					type="text"
					bind:value={query}
					on:input={search}
					placeholder="Search documentation"
					id="search"
				/>
			</div>
		</form>
		<div class="w-full h-[1px] bg-white/20" />
		<div class="px-3 overflow-y-auto py-2">
			{#if results.length > 0}
				{#each results as result}
					<div class="px-2 py-2 rounded-md hover:bg-slate-300/25">
						<a class="block text-left" href={result.item.path} on:click={close}>
							<p class="text-lg font-bold text-white">{result.item.title}</p>
							<p class="text-white/70">{result.item.path}</p>
						</a>
					</div>
				{/each}
			{:else}
				<div class="h-40 flex items-center justify-center">
					<p class="text">No recent searches</p>
				</div>
			{/if}
		</div>
	</div>
</div>
