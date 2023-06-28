<script lang="ts">
	import { page } from '$app/stores'
	import { App } from '$lib/app/app'
	import GithubIcon from '$lib/components/icons/github_icon.svelte'
	import RightArrowIcon from '$lib/components/icons/right_arrow_icon.svelte'
	import VersionFooter from '$lib/components/version_footer.svelte'
	import { current_page_category, current_page_title } from '$lib/docs/current_page_store'
	import { theme } from '$lib/stores'
	import { MetaTags } from 'svelte-meta-tags'
	import OnThisPage from './on_this_page.svelte'
	import { base } from '$app/paths'
	// import '/node_modules/highlight.js/styles/atom-one-dark.css'
	// import '/node_modules/highlight.js/styles/atom-one-light.css'

	export let data

	const github_base_path = 'https://github.com/sinProject-Inc/talk/edit/main'

	$: git_path = `${github_base_path}${data.file_path.slice(1)}`
	$: pages = data.sections?.flatMap((section) => section.pages) ?? []
	$: page_index = pages.findIndex(({ path }) => path === $page.url.pathname)
	$: prev_page = pages[page_index - 1]
	$: next_page = pages[page_index + 1]

	$: current_page_title.set(data.page.title)
	$: current_page_category.set(data.category)

	/* eslint-disable svelte/no-at-html-tags */
</script>

<svelte:head>
	{#if $theme === 'dark'}
		<link rel="stylesheet" href="{base}/styles/atom-one-dark.css" />
	{:else}
		<link rel="stylesheet" href="{base}/styles/atom-one-light.css" />
	{/if}

	<style>
		html {
			scroll-padding-top: calc(var(--header-height) * 2 + 2rem);
		}

		@media (min-width: 768px) {
			html {
				scroll-padding-top: calc(var(--header-height) + 2rem);
			}
		}

		.content ul > li {
			padding-left: 1.7em;
			position: relative;
			margin: 0.5em 0;
		}

		p:not(.category) {
			line-height: 2rem;
			margin-bottom: 1.2rem !important;
			/* @apply leading-8 space-y-4; */
		}
	</style>
</svelte:head>

<MetaTags title={App.get_docs_title(data.page.title)} description={data.page.description} />

<div class="glass-text-3">
	<div>
		<p class="slide-fade-in category">{data.category}</p>

		<div class="content">
			<h1 class="slide-fade-in glass-text-5">{data.page.title}</h1>

			<div
				class="glass-text-3 mb-5 text-sm font-semibold hover:text-primary-10 dark:hover:text-primary-dark-4"
			>
				<a
					href={git_path}
					target="_blank"
					rel="noreferrer"
					class="flex items-center gap-1 border-none"
					><div class="h-nav-icon">
						<GithubIcon />
					</div>
					<div>Edit this page</div>
					<div class="-mx-2 h-1 w-1">
						<RightArrowIcon />
					</div>
				</a>
			</div>

			{@html data.page.html_content}
		</div>

		<footer class="text-s mt-12 leading-6">
			<div class="glass-text-3 flex items-center text-sm font-semibold">
				{#if prev_page}
					<a
						href={prev_page.path}
						class="flex items-center hover:text-primary-10 dark:hover:text-primary-dark-4"
					>
						<!-- class="mr-3 h-1.5 w-auto overflow-visible dark:text-primary-dark-3 text-primary-3 group-hover:dark:text-primary-3 text-primary-dark-3 dark:group-dark:hover:text-primary-dark-4 hover:text-primary-4" -->
						<svg viewBox="0 0 3 6" class="mr-3 h-1.5 w-auto overflow-visible"
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
						href={next_page.path}
						class="ml-auto flex items-center text-end hover:text-primary-10 dark:hover:text-primary-dark-4"
						>{next_page.title}<svg viewBox="0 0 3 6" class="ml-3 h-1.5 w-auto overflow-visible"
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

	<div class="mt-8 border-t border-slate-200 pt-8 dark:border-slate-200/5">
		<VersionFooter />
	</div>

	<OnThisPage details={data.page} />
</div>

<!-- <style lang="postcss">
	/* .content a:not(.border-none):not(.permalink):not(.code-title) {
		@apply border border-b-[1px] border-secondary font-semibold text-primary-10 dark:border-secondary-dark dark:text-primary-dark-10;
	}

	.content a:not(.border-none):not(.permalink):not(.code-title):hover {
		@apply -mb-[1px] border-b-2 border-secondary dark:border-secondary-dark;
	} */
</style> -->

<style lang="postcss">
	:global(.content a:not(.border-none):not(.permalink):not(.code-title)) {
		@apply border-b-[1px] border-secondary font-semibold  text-primary-10;
	}

	:global(html.dark .content a:not(.border-none):not(.permalink):not(.code-title)) {
		@apply border-secondary-dark text-primary-dark-10;
	}

	:global(.content a:not(.border-none):not(.permalink):not(.code-title):hover) {
		@apply -mb-[1px] border-b-2 border-secondary;
	}

	:global(html.dark .content a:not(.border-none):not(.permalink):not(.code-title):hover) {
		@apply border-secondary-dark;
	}

	:global(.content ul > li::before) {
		@apply bg-primary-4;

		content: '';
		width: 0.75em;
		height: 0.125em;
		position: absolute;
		top: 11px;
		left: 0;
		border-radius: 999px;
	}

	:global(html.dark .content ul > li::before) {
		@apply bg-primary-dark-4;
	}

	:global(.code-container) {
		@apply border border-primary-9/[0.06];
		margin: 1.2rem 0 !important;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	:global(html.dark .code-container) {
		@apply border-primary-dark-9/[0.06];
	}

	:global(.code-container > div) {
		@apply bg-primary-dark-8;
		padding: 0.5rem 1rem;
		backdrop-filter: blur(4px);
	}

	:global(html.dark .code-container > div) {
		@apply bg-primary-8;
	}

	:global(code.hljs) {
		@apply bg-primary-dark-8/50;
		backdrop-filter: blur(4px);
	}

	:global(html.dark code.hljs) {
		@apply bg-primary-8/50;
		backdrop-filter: blur(4px);
	}

	:global(code:not(.hljs)) {
		@apply bg-secondary/10;
		padding: 0.25rem 0.5rem;
		font-weight: 400;
		/* color: #e2e8f0; */
		border-radius: 0.4rem;
	}

	:global(html.dark code:not(.hljs)) {
		@apply bg-secondary-dark/10;
	}
</style>
