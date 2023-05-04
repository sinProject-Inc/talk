<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import type Fuse from 'fuse.js'
	import search_index from '$lib/assets/search_index.json'
	import SearchIcon from '$lib/components/icons/search_icon.svelte'
	import { Search } from '$lib/docs/search'
	import { SearchResultContext, type SplitContextPortion } from '$lib/docs/search_result_context'
	import type { MarkdownData } from '$lib/docs/search_index'

	let query: string

	let results: Fuse.FuseResult<MarkdownData>[] = []
	let active_result_index = 0

	// TODO: Remove type assertion
	const search = new Search(search_index as MarkdownData[])

	function get_search_results(): void {
		if (query.trim().length === 0) {
			results = []

			return
		}

		results = search.search(query)
		active_result_index = 0
	}

	function get_context(result: Fuse.FuseResult<MarkdownData>): SplitContextPortion[] {
		if (!result.matches) return []

		const context_max_length = 200

		const context = new SearchResultContext(result.matches[0], query)
		const split_context = context.get_split_context()

		const shortened_split_context = context.shorten_split_context(split_context, context_max_length)

		return shortened_split_context
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

		if (event.key === 'ArrowUp') {
			if (active_result_index <= 0) return

			active_result_index--
		}

		if (event.key === 'ArrowDown') {
			if (active_result_index >= results.length - 1) return

			active_result_index++
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

	function on_mouse_to_result(result_index: number): void {
		active_result_index = result_index
	}

	onMount(() => {
		window.addEventListener('wheel', handle_scroll, { passive: false })
	})

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<svelte:window on:keydown={handle_keydown} />

<div class="fixed top-0 left-0 w-screen h-screen pointer-events-auto z-10" on:click={close} />

<div
	class="fixed top-0 left-0 w-full h-full justify-center flex pointer-events-none px-4 z-20 backdrop-blur-sm py-20"
>
	<div
		class="rounded-xl glass-panel bg-slate-800/90 backdrop-blur-md pointer-events-auto text-center mx-auto max-w-screen-md w-full h-fit max-h-[calc(75vh)] flex flex-col"
	>
		<form class="px-4 py-3" on:submit|preventDefault={get_search_results} autocomplete="off">
			<div class="flex">
				<label class="w-7" for="search"><SearchIcon /></label>
				<input
					class="w-full pl-4 text-xl bg-inherit"
					type="text"
					bind:value={query}
					on:input={get_search_results}
					placeholder="Search documentation"
					id="search"
				/>
			</div>
		</form>
		<div class="w-full h-[1px] bg-white/20" />
		<div class="popup px-3 overflow-y-auto py-2">
			{#if results.length > 0}
				{#each results as result, i}
					<div
						class="px-2 py-2 rounded-md"
						class:active={active_result_index === i}
						on:mouseenter={() => on_mouse_to_result(i)}
					>
						<a class="block text-left" href="${result.item.path}" on:click={close}>
							<div class="text-lg font-bold text-white">{result.item.title}</div>
							<div class="text-white/90">
								{#each get_context(result) as context_potion}
									{#if context_potion.is_match}
										<span class="font-bold border-b border-[#38bdf8]">{context_potion.text}</span>
									{:else}
										{context_potion.text}
									{/if}
								{/each}
							</div>
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

<style lang="postcss">
	.active {
		@apply bg-slate-300/25;
	}
</style>
