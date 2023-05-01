<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/stores'
	import type { PageData } from './$types'

	export let details: PageData['page']

	let active_elements: Element[] = []
	let active_section_ids: string[] = []

	function get_previous_heading(element: Element): Element | undefined {
		const previous_element = element.previousElementSibling

		if (!previous_element) return undefined

		if (previous_element.tagName === 'H1' || previous_element.tagName === 'H2') {
			return previous_element
		}

		return get_previous_heading(previous_element)
	}

	// オブザーバーを定義する関数
	function observe_contents(): void {
		const content = document.querySelector('.content')

		// console.log('content', content)

		const headings = content?.querySelectorAll('h1, h2[id]')

		if (!headings) return

		// console.log('headings', headings)

		const content_observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					active_elements = [...active_elements, entry.target]
				} else {
					active_elements = active_elements.filter((element) => element !== entry.target)
				}

				const heading_set = new Set(active_elements.map((element) => get_previous_heading(element)))

				// console.log('heading_set', heading_set)

				active_section_ids = [...heading_set].map((heading) => heading?.id ?? '')

				// console.log('active_section_ids', active_section_ids)
			})
		})

		headings.forEach((heading, index) => {
			const next_heading = index < headings.length - 1 ? headings[index + 1] : undefined

			let next_element = heading.nextElementSibling

			while (next_element && next_element !== next_heading) {
				content_observer.observe(next_element)
				next_element = next_element.nextElementSibling
			}
		})
	}

	function contains(ids: string[], id: string): boolean {
		return ids.includes(id)
	}

	afterNavigate(() => {
		observe_contents()
	})
</script>

<aside
	class="top-[var(--header-height)] py-8 pe-8 w-72 leading-6 text-sm h-screen fixed overflow-y-auto hidden xl:block end-[max(0px,calc(50%-45rem))]"
>
	<h5 class="font-semibold mb-4">On this page</h5>
	<nav>
		<ul class="border-l space-y-2 border-slate-800">
			<li>
				<a
					href={$page.url.pathname}
					class="block pl-4 -ml-px border-l"
					class:active={contains(active_section_ids, '')}>{details.title}</a
				>
			</li>
			{#each details.sections as { title, slug }}
				<li>
					<a
						href={`#${slug}`}
						class="block pl-4 -ml-px border-l"
						class:active={contains(active_section_ids, slug)}>{title}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style lang="postcss">
	a:not(.active) {
		@apply border-transparent hover:border-slate-500 text-slate-400 hover:text-slate-300;
	}

	.active {
		@apply border-current text-sky-400;
	}
</style>
