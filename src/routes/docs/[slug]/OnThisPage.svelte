<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/stores'
	import type { PageData } from './$types'

	export let details: PageData['page']

	let active_elements: Element[] = []
	let active_section_ids: string[] = []

	function get_previous_heading(element: Element | null): Element | undefined {
		if (!element) return undefined

		if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
			return element
		}

		return get_previous_heading(element.previousElementSibling)
	}

	// オブザーバーを定義する関数
	function observe_contents(): void {
		const content = document.querySelector('.content')

		// console.log('content', content)

		const headings = content?.querySelectorAll('h1, h2[id], h3[id]')

		if (!headings) return

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

			let next_element: Element | null = heading

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
	class="fixed end-[max(0px,calc(50%-45rem))] top-[var(--header-height)] hidden h-full w-72 overflow-y-auto pb-[calc(2rem+var(--header-height))] pe-8 pt-8 text-sm leading-6 xl:block"
>
	<h5 class="mb-4 font-semibold">On this page</h5>
	<nav class="slide-fade-in">
		<ul class="space-y-2 border-l border-slate-800">
			<li>
				<a
					href={$page.url.pathname}
					class="-ms-px block border-s ps-3"
					class:active={contains(active_section_ids, '')}>{details.title}</a
				>
			</li>
			{#each details.sections as { level, title, slug }}
				<li class="pl-{(level - 1) * 2}">
					<a
						href={`#${slug}`}
						class="-ml-px block border-l pl-3"
						class:active={contains(active_section_ids, slug)}>{title}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style lang="postcss">
	a:not(.active) {
		@apply border-transparent text-slate-400 hover:border-slate-500 hover:text-slate-300;
	}

	.active {
		@apply border-current text-sky-400;
	}
</style>
