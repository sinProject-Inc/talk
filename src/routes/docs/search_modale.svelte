<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'

	import Fuse from 'fuse.js'
	import search_index from '$lib/assets/search_index.json'
	import SearchIcon from '$lib/components/icons/search_icon.svelte'

	const test_div_count = Array(10).fill(null)

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
		release_scroll()
		dispatch('close')
	}

	function handle_keydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			close()
			return
		}
	}

	function handle_scroll(event: WheelEvent): void {
		const target = event.target
		const delta_y = event.deltaY

		if (!(target instanceof HTMLElement)) return

		if (results_div_has_overflow(target, delta_y)) return

		event.preventDefault()
	}

	function release_scroll(): void {
		document.removeEventListener('wheel', handle_scroll)
	}

	function results_div_has_overflow(target: HTMLElement, delta_y: number): boolean {
		let scroll_height = 0
		let client_height = 0
		let scroll_top = 0

		const target_parent = target.closest('.popup')

		if (target_parent) {
			scroll_height = target_parent.scrollHeight
			client_height = target_parent.clientHeight
			scroll_top = target_parent.scrollTop
		}

		if (scroll_top === 0 && delta_y < 0) return false
		if (scroll_top + client_height === scroll_height && delta_y > 0) return false

		return true
	}

	onMount(() => {
		document.addEventListener('wheel', handle_scroll, { passive: false })
	})
</script>

<svelte:window on:keydown={handle_keydown} />

<div class="fixed top-0 left-0 w-screen h-screen pointer-events-auto z-10" on:click={close} />

<div
	class="fixed top-0 left-0 w-full h-full justify-center flex pointer-events-none px-4 z-20 backdrop-blur-sm py-20"
>
	<div
		class="rounded-xl glass-panel bg-slate-800/90 backdrop-blur-md pointer-events-auto text-center mx-auto max-w-screen-md w-full h-fit max-h-[calc(75vh)] flex flex-col"
	>
		<form class="px-4 py-3" on:submit|preventDefault={search} autocomplete="off">
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
		<div class="popup px-3 overflow-y-auto py-2">
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
				{#each test_div_count as count}
					<div class="px-2 py-2 rounded-md hover:bg-slate-300/25">
						<div class="block text-left">
							<p class="text-lg font-bold text-white">aaaa</p>
							<p class="text-white/70">bbbb</p>
						</div>
					</div>
				{/each}
				<div class="h-40 flex items-center justify-center">
					<p class="text">No recent searches</p>
				</div>
			{/if}
		</div>
	</div>
</div>
