<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/stores'
	import GithubIcon from '$lib/components/icons/github_icon.svelte'
	import RightArrowIcon from '$lib/components/icons/right_arrow_icon.svelte'
	import { current_page_category, current_page_title } from '$lib/docs/current_page_store'
	import OnThisPage from './OnThisPage.svelte'
	import '/node_modules/highlight.js/styles/atom-one-dark.css'

	export let data

	const github_base_path = 'https://github.com/sinProject-Inc/talk/edit/main'

	$: git_path = `${github_base_path}${data.file_path.slice(1)}`
	$: pages = data.sections?.flatMap((section) => section.pages) ?? []
	$: page_index = pages.findIndex(({ path }) => path === $page.url.pathname)
	$: prev_page = pages[page_index - 1]
	$: next_page = pages[page_index + 1]

	$: current_page_title.set(data.page.title)
	$: current_page_category.set(data.category)

	function add_copy_code_event(): void {
		const copy_code_elements = document.querySelectorAll('.copy-code')

		copy_code_elements.forEach((element) => {
			element.addEventListener('click', (event) => {
				if (!event.target) return

				const target_element = event.target as HTMLElement
				let current_element = target_element.parentElement

				while (current_element) {
					if (current_element.classList.contains('code-container')) break

					current_element = current_element.parentElement
				}

				if (!current_element) return

				const code = current_element.querySelector('code')?.textContent ?? ''

				navigator.clipboard.writeText(code)
			})
		})
	}

	afterNavigate(() => {
		add_copy_code_event()
	})
</script>

<svelte:head>
	<title>{data.page.title} - sinProject Talk</title>
	<style>
		html {
			scroll-padding-top: calc(var(--header-height) * 2 + 2rem);
		}

		@media (min-width: 768px) {
			html {
				scroll-padding-top: calc(var(--header-height) + 2rem);
			}
		}

		.content a:not(.border-none):not(.permalink):not(.code-title) {
			color: #fff;
			font-weight: 600;
			border-bottom: 1px solid #38bdf8;
		}

		.content a:not(.border-none):not(.permalink):not(.code-title):hover {
			border-bottom: 2px solid #38bdf8;
		}

		.content ul > li {
			padding-left: 1.7em;
			position: relative;
			margin: 0.5em 0;
		}

		.content ul > li::before {
			content: '';
			width: 0.75em;
			height: 0.125em;
			position: absolute;
			top: 11px;
			left: 0;
			border-radius: 999px;
			background-color: #cbd5e1;
		}

		.code-container {
			margin: 1.2rem 0 !important;
			border-radius: 0.5rem;
			border: 1px solid rgb(248 250 252 / 0.06);
			overflow: hidden;
		}

		.code-container > div {
			padding: 0.5rem 1rem;
			background-color: #0f172aff;
			backdrop-filter: blur(4px);
			/* background-color: rgb(248 250 252 / 0.06) */
		}

		code.hljs {
			/* border: 1px solid rgb(248 250 252 / 0.06); */
			background-color: #0f172a88;
			backdrop-filter: blur(4px);
		}

		p:not(.category) {
			line-height: 2rem;
			margin-bottom: 1.2rem !important;
			/* @apply leading-8 space-y-4; */
		}

		.github-link::before {
			content: url('/talk/github_icon.svg');
			position: relative;
			top: 4px;
		}

		.link-with-arrow::after {
			content: url('/talk/right_arrow.svg');
			position: relative;
		}

		/* code:not(.hljs) {
			// /* color: #f00; */
		/* padding: 0.25rem 0.5rem; */
		/* background-color: #0f172a88; */
		/* border-radius: 0.4rem; */
		/* } */
	</style>
</svelte:head>

<div class="text-slate-400">
	<div>
		<p class="category">{data.category}</p>

		<div class="content">
			<h1 class="text-slate-200">{data.page.title}</h1>

			<div class="mb-5 text-sm font-semibold text-slate-400 hover:text-slate-300">
				<a
					href={git_path}
					target="_blank"
					rel="noreferrer"
					class="flex items-center gap-1 border-none"
					><div class="h-5 w-5">
						<GithubIcon />
					</div>
					<div>Edit this page</div>
					<div class="-mx-3 h-1 w-1">
						<RightArrowIcon />
					</div>
				</a>
			</div>

			{#if data.page.description}
				<span>{data.page.description}</span>
			{/if}

			{@html data.page.html_content}
		</div>

		<footer class="text-s mt-12 leading-6">
			<div class="flex items-center text-sm font-semibold text-slate-200">
				{#if prev_page}
					<a href={prev_page.path} class="group flex items-center hover:text-white">
						<svg
							viewBox="0 0 3 6"
							class="mr-3 h-1.5 w-auto overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
							><path
								d="M3 0L0 3L3 6"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/></svg
						>{prev_page.title}</a
					>
				{/if}

				{#if next_page}
					<a
						data-testid="next-page"
						class="group ml-auto flex items-center hover:text-slate-900 dark:hover:text-white"
						href={next_page.path}
						>{next_page.title}<svg
							viewBox="0 0 3 6"
							class="ml-3 h-1.5 w-auto overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
							><path
								d="M0 0L3 3L0 6"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/></svg
						></a
					>
				{/if}
			</div>
		</footer>
	</div>

	<OnThisPage details={data.page} />
</div>
