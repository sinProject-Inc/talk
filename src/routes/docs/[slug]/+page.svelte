<script lang="ts">
	import { page } from '$app/stores'
	import OnThisPage from './on_this_page.svelte'

	export let data

	const github_base_path = 'https://github.com/sinProject-Inc/talk/edit/main'
	const git_path = `${github_base_path}${data.file_path.slice(1)}`

	$: pages = data.sections?.flatMap((section) => section.pages) ?? []
	$: page_index = pages.findIndex(({ path }) => path === $page.url.pathname)
	$: prev_page = pages[page_index - 1]
	$: next_page = pages[page_index + 1]
</script>

<svelte:head>
	<title>{data.page.title} - sinProject Talk</title>
	<style>
		.content a:not(.border-none) {
			color: #fff;
			font-weight: 600;
			border-bottom: 1px solid #38bdf8;
		}

		.content a:not(.border-none):hover {
			border-bottom: 2px solid #38bdf8;
		}
	</style>
</svelte:head>

<div class="text-slate-400">
	<div class="pe-80">
		<p class="category">{data.category}</p>
		<h1 class="text-slate-200">{data.page.title}</h1>

		<div class="text-sm mb-5 text-slate-400 hover:text-slate-300 font-semibold">
			<a href={git_path} target="_blank" rel="noreferrer">Edit this page on GitHub</a>
		</div>

		<div class="content">
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
