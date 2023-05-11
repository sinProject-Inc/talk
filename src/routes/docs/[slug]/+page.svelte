<script lang="ts">
	import { page } from '$app/stores'
	import OnThisPage from './OnThisPage.svelte'
	import '/node_modules/highlight.js/styles/atom-one-dark.css'
	import { current_page_title, current_page_category } from '$lib/docs/current_page_store'

	export let data

	const github_base_path = 'https://github.com/sinProject-Inc/talk/edit/main'

	$: git_path = `${github_base_path}${data.file_path.slice(1)}`
	$: pages = data.sections?.flatMap((section) => section.pages) ?? []
	$: page_index = pages.findIndex(({ path }) => path === $page.url.pathname)
	$: prev_page = pages[page_index - 1]
	$: next_page = pages[page_index + 1]

	$: current_page_title.set(data.page.title)
	$: current_page_category.set(data.category)
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

		.content a:not(.border-none):not(.permalink) {
			color: #fff;
			font-weight: 600;
			border-bottom: 1px solid #38bdf8;
		}

		.content a:not(.border-none):not(.permalink):hover {
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

		code.hljs {
			margin: 1.2rem 0;
			border-radius: 0.75rem;
			border: 1px solid rgb(248 250 252 / 0.06);
			background-color: #0f172a88;
			backdrop-filter: blur(4px);
		}

		p:not(.category) {
			line-height: 2rem;
			margin-bottom: 1.2rem !important;
			/* @apply leading-8 space-y-4; */
		}

		code:not(.hljs) {
			/* color: #f00; */
			padding: 0.25rem 0.5rem;
			background-color: #0f172a88;
			border-radius: 0.4rem;
			/* color: #e2e8f0; */
		}
	</style>
</svelte:head>

<div class="text-slate-400">
	<div>
		<p class="category">{data.category}</p>

		<div class="content">
			<h1 class="text-slate-200">{data.page.title}</h1>

			<div class="text-sm mb-5 text-slate-400 hover:text-slate-300 font-semibold">
				<a href={git_path} target="_blank" rel="noreferrer" class="border-none"
					>Edit this page on GitHub</a
				>
			</div>

			{#if data.page.description}
				<span>{data.page.description}</span>
			{/if}

			{@html data.page.html_content}
		</div>

		<footer class="text-s leading-6 mt-12">
			<div class="text-sm text-slate-200 font-semibold flex items-center">
				{#if prev_page}
					<a href={prev_page.path} class="group flex items-center hover:text-white">
						<svg
							viewBox="0 0 3 6"
							class="mr-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
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
							class="ml-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
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
