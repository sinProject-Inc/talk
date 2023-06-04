<script lang="ts">
	import { page } from '$app/stores'
	import SearchIcon from '$lib/components/icons/search_icon.svelte'
	import type { Section } from '$lib/docs/markdown'
	import { CommandOrControlShortcut } from '$lib/view/modifier_key'
	import { createEventDispatcher } from 'svelte'

	export let sections: Section[]
	export let search_bar_enabled = true

	const dispatch = createEventDispatcher()

	function on_search_button_click(): void {
		dispatch('show_search_modale')
	}

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
			class="fixed top-[84px] h-16 w-56 rounded-2xl bg-gradient-to-t from-transparent via-slate-800 to-slate-800"
		/>
		<button
			class="glass-panel fixed top-[84px] flex w-56 items-center gap-3 rounded-md bg-slate-900/90 shadow-lg shadow-slate-900/70 transition-all duration-150 hover:bg-slate-600/75"
			on:click={on_search_button_click}
		>
			<div class="h-5"><SearchIcon /></div>
			<div class="flex w-full justify-between pr-2">
				<div class="flex">Search</div>
				<div class="flex">{CommandOrControlShortcut.generate('k')}</div>
			</div>
		</button>
	{/if}

	<div class="pl-1 pt-8">
		{#each sections as section}
			<li class="my-8">
				<h5 class="glass-text-5 mb-3 font-semibold">
					{section.title}
				</h5>
				<ul class="space-y-2 border-l border-primary-dark-5 dark:border-primary-5">
					{#each section.pages as { title, path }}
						{@const active = path === $page.url.pathname}
						{@const inactive = !active}
						<li>
							<a href={path} class="-ml-px block border-l pl-4" class:active class:inactive>
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
		@apply border-current text-secondary dark:text-secondary-dark;
	}

	.inactive {
		@apply border-transparent  text-primary-3  hover:border-slate-500 hover:text-primary-4 dark:text-primary-dark-3 dark:hover:border-primary-dark-2 dark:hover:text-primary-dark-4;
	}
</style>
