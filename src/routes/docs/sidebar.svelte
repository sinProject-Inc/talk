<script lang="ts">
	import { page } from '$app/stores'
	import type { Section } from '$lib/view/markdown'

	export let sections: Section[] = []
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
	{#each sections as section}
		<li class="mt-8">
			<h5 class="font-semibold mb-3 text-slate-200">
				{section.title}
			</h5>
			<ul class="border-l space-y-2 border-slate-800">
				{#each section.pages as { title, path }}
					<li>
						<a
							href={path}
							class="block pl-4 -ml-px border-l {path === $page.url.pathname
								? 'border-current text-sky-400'
								: 'border-transparent hover:border-slate-500 text-slate-400 hover:text-slate-300'}"
						>
							{title}
						</a>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
