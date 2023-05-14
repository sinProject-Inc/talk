<script lang="ts">
	import { page } from '$app/stores'
	import SearchIcon from '$lib/components/icons/search_icon.svelte'
	import type { Section } from '$lib/docs/markdown'
	import { createEventDispatcher } from 'svelte'
	import { onMount } from 'svelte'
	import { ModifierKey } from '$lib/view/modifier_key'

	export let sections: Section[]
	export let search_bar_enabled = true

	let view_shortcut_key = ''

	const dispatch = createEventDispatcher()

	function on_search_button_click(): void {
		dispatch('show_search_modale')
	}

	function set_view_shortcut_key(): void {
		const modifier_key = new ModifierKey()

		view_shortcut_key = modifier_key.get_control_or_command_symbol()
	}

	onMount(() => {
		set_view_shortcut_key()
	})

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<!-- <div class="sticky top-0 -ml-0.5 pointer-events-none">
	<div class="bg-white dark:bg-slate-900 relative pointer-events-auto">
		<button
			type="button"
			class="hidden w-full lg:flex items-center text-sm leading-6 text-slate-400 rounded-md ring-1 ring-slate-900/10 shadow-sm py-1.5 pl-2 pr-3 hover:ring-slate-300 dark:bg-slate-800 dark:highlight-white/5 dark:hover:bg-slate-700"
			><svg width="24" height="24" fill="none" aria-hidden="true" class="mr-3 flex-none"
				><path
					d="m19 19-3.5-3.5"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/><circle
					cx="11"
					cy="11"
					r="6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			>Quick search...<span class="ml-auto pl-3 flex-none text-xs font-semibold">⌘K</span></button
		>
	</div>
</div> -->

<ul class="text-sm leading-6">
	{#if search_bar_enabled}
		<div
			class="fixed top-24 bg-gradient-to-t rounded-2xl from-transparent via-slate-800 to-slate-800 h-16 w-56"
		/>
		<button
			class="flex fixed top-24 glass-panel gap-3 items-center w-56 rounded-md bg-slate-900/90 hover:bg-slate-600/75 transition-all duration-150 shadow-lg shadow-slate-900/70"
			on:click={on_search_button_click}
		>
			<div class="h-5"><SearchIcon /></div>
			<div class="flex w-full justify-between pr-2">
				<div class="flex">Search</div>
				{#if view_shortcut_key}
					<div class="flex">{view_shortcut_key}K</div>
				{/if}
			</div>
		</button>
	{/if}

	<div class="pt-8 pl-1">
		{#each sections as section}
			<li class="my-8">
				<h5 class="font-semibold mb-3 text-slate-200">
					{section.title}
				</h5>
				<ul class="border-l space-y-2 border-slate-800">
					{#each section.pages as { title, path }}
						{@const active = path === $page.url.pathname}
						{@const inactive = !active}
						<li>
							<a href={path} class="block pl-4 -ml-px border-l" class:active class:inactive>
								{title}
							</a>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</div>
</ul>

<style lang="postcss">
	.active {
		@apply border-current text-sky-400;
	}

	.inactive {
		@apply border-transparent hover:border-slate-500 text-slate-400 hover:text-slate-300;
	}
</style>
