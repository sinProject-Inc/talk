<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	export let details: PageData['page']

	// const a = 0
</script>

<aside class="fixed top-0 end-0 py-8 pe-8 w-72 leading-8 text-sm">
	<h5 class="font-semibold mb-4">On this page</h5>
	<nav>
		<ul class="text-slate-400">
			<li><a href={$page.url.pathname}>{details.title}</a></li>
			{#each details.sections as { title, slug }}
				<li>
					<a href={`#${slug}`}>{title}</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style lang="postcss">
	a {
		@apply hover:text-slate-300;
	}
</style>
