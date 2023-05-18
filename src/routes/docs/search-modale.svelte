<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import type Fuse from 'fuse.js'
	import search_index from '$lib/assets/search_index.json'
	import SearchIcon from '$lib/components/icons/search_icon.svelte'
	import { Search } from '$lib/docs/search'
	import { SearchResultContext, type SplitContextPortion } from '$lib/docs/search_result_context'
	import type { MarkdownData } from '$lib/docs/search_index'
	import { goto } from '$app/navigation'
	import CloseIcon from '$lib/components/icons/close_icon.svelte'

	export let search_query = ''

	let input: HTMLInputElement

	let results: Fuse.FuseResult<MarkdownData>[] = []
	let active_result_index = 0
	let results_element: HTMLElement

	const markdown_data = search_index as MarkdownData[]
	const search = new Search(markdown_data)

	get_search_results()

	function get_search_results(): void {
		if (search_query.trim().length === 0) {
			results = []

			return
		}

		results = search.search(search_query)
		active_result_index = 0

		input = input
	}

	function get_context(result: Fuse.FuseResult<MarkdownData>): SplitContextPortion[] {
		if (!result.matches) return []

		const context_max_length = 200

		const context = new SearchResultContext(result.matches[0], search_query)
		const split_context = context.get_split_context()

		const shortened_split_context = context.shorten_split_context(split_context, context_max_length)

		return shortened_split_context
	}

	const dispatch = createEventDispatcher()

	function close(): void {
		release_scroll()
		dispatch('close')
	}

	function reset_search_query(): void {
		search_query = ''
		get_search_results()

		input.focus()
	}

	function set_active_result_index(delta_y: number): void {
		if (results.length === 0) return

		active_result_index = active_result_index + delta_y

		if (active_result_index < 0) {
			active_result_index = results.length - 1
		}

		if (active_result_index >= results.length) {
			active_result_index = 0
		}
	}

	function set_scroll_result(): void {
		if (results.length === 0) return

		const parent = results_element

		if (!parent) return

		const children = parent.children

		if (!children) return

		let first_result_top = children[0].getBoundingClientRect().top
		let active_result_top = children[active_result_index].getBoundingClientRect().top
		let active_result_bottom = children[active_result_index].getBoundingClientRect().bottom

		let scroll_top = parent.scrollTop + Math.floor(first_result_top)
		let scroll_bottom = parent.scrollTop + parent.clientHeight + Math.floor(first_result_top)

		set_scroll_top(parent, first_result_top, active_result_top, scroll_top)
		set_scroll_bottom(parent, first_result_top, active_result_bottom, scroll_bottom)
	}

	function set_scroll_top(
		parent: HTMLElement,
		first_result_top: number,
		active_result_top: number,
		scroll_top: number
	): void {
		if (active_result_top >= scroll_top) return

		parent.scrollTop = active_result_top - Math.floor(first_result_top)
	}

	function set_scroll_bottom(
		parent: HTMLElement,
		first_result_top: number,
		active_result_bottom: number,
		scroll_bottom: number
	): void {
		const bottom_padding = 23
		const adjusted_bottom = active_result_bottom + bottom_padding

		if (adjusted_bottom <= scroll_bottom) return

		const active_result_top = adjusted_bottom - parent.clientHeight

		parent.scrollTop = active_result_top - Math.floor(first_result_top)
	}

	function handle_keydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			close()
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault()

			const delta_y = -1

			set_active_result_index(delta_y)
			set_scroll_result()
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault()

			const delta_y = 1

			set_active_result_index(delta_y)
			set_scroll_result()
		}

		if (event.key === 'Enter') {
			const active_result = results[active_result_index]

			if (!active_result) return

			close()
			goto(`${active_result.item.path}`)
		}

		if (event.key === 'Tab') {
			event.preventDefault()

			const delta_y = event.shiftKey ? -1 : 1

			set_active_result_index(delta_y)
			set_scroll_result()
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
		window.removeEventListener('wheel', handle_scroll)
	}

	function results_div_has_overflow(target: HTMLElement, delta_y: number): boolean {
		let scroll_height = 0
		let client_height = 0
		let scroll_top = 0

		const target_parent = target.closest('.result')

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

		input.focus()
		input.select()
	})

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<svelte:window on:keydown={handle_keydown} />

<div
	class="pointer-events-auto fixed left-0 top-0 z-10 h-screen w-screen"
	on:click={close}
	on:keydown
/>

<div
	class="pointer-events-none fixed left-0 top-0 z-20 flex h-full w-full justify-center p-6 backdrop-blur-sm md:p-20 lg:px-20 lg:py-28"
>
	<div
		class="glass-panel pointer-events-auto mx-auto flex h-fit max-h-full w-full max-w-screen-md flex-col rounded-xl bg-slate-900/90 text-center backdrop-blur-md"
		data-testid="search-modale"
	>
		<form class="px-4 py-3" on:submit|preventDefault={get_search_results} autocomplete="off">
			<div class="flex items-center justify-between">
				<label class="w-7" for="search"><SearchIcon /></label>
				<input
					class="w-full bg-inherit pl-4"
					type="text"
					bind:value={search_query}
					bind:this={input}
					on:input={get_search_results}
					placeholder="Search documentation"
					id="search"
				/>
				<div class="h[24px] mr-4 flex w-[30px]">
					{#if search_query !== ''}
						<div
							class="flex h-[24px] w-full cursor-pointer select-none items-center justify-center rounded-md px-[5px] text-[10px] text-white/50 outline outline-1 outline-white/50 transition-all duration-200 hover:text-red-400 hover:outline-red-400"
							on:click={reset_search_query}
							on:keydown
						>
							<CloseIcon />
						</div>
					{/if}
				</div>
				<div
					class="flex h-[24px] cursor-pointer select-none items-center justify-center rounded-md px-[5px] text-[10px] text-white/50 outline outline-1 outline-white/50 transition-all duration-200 hover:text-white/80 hover:outline-white/80"
					on:click={close}
					on:keydown
				>
					ESC
				</div>
			</div>
		</form>
		<div class="h-[1px] w-full bg-white/20" />
		<div class="result overflow-y-auto px-3 py-3" bind:this={results_element}>
			{#if results.length > 0}
				{#each results as result, i}
					<div
						class="rounded-md px-2 py-2"
						class:active={active_result_index === i}
						on:mousemove={() => on_mouse_to_result(i)}
					>
						<a class="block text-left" href={result.item.path} on:click={close}>
							<div class="text-lg font-bold text-white">{result.item.title}</div>
							<div class="text-white/90">
								{#each get_context(result) as context_potion}
									{#if context_potion.is_match}
										<span class="border-b border-[#38bdf8] font-bold">{context_potion.text}</span>
									{:else}
										{context_potion.text}
									{/if}
								{/each}
							</div>
						</a>
					</div>
				{/each}
			{:else}
				<div class="flex h-40 items-center justify-center">
					{#if input?.value.length > 0}
						<p>No results for "{input.value}"</p>
					{:else}
						<p>No recent searches</p>
					{/if}
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
