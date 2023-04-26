<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	export let details: PageData['page']

	// const a = 0
</script>

<aside>
	<h2>On this page</h2>
	<nav>
		<ul>
			<li><a href={$page.url.pathname}>{details.title}</a></li>
			{#each details.sections as { title, slug }}
				<li>
					<a href={`#${slug}`}>{title}</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>
