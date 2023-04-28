<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	export let details: PageData['page']

	// オブザーバーを定義する関数
	function create_observer(): void {
		const content = document.querySelector('.content')
		const headings = content?.querySelectorAll('h1, h2[id]')

		if (!headings) return

		const next_element_observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const previous_element = entry.target.previousElementSibling

				if (!previous_element) return

				if (entry.isIntersecting) {
					// console.log('true', previous_element.id)
				} else {
					// console.log('false', previous_element.id)
				}
			})
		})

		headings.forEach((heading) => {
			const next_element = heading.nextElementSibling

			if (!next_element) return

			next_element_observer.observe(next_element)
		})
	}

	onMount(async () => {
		create_observer()
	})
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
