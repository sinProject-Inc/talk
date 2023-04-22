<script lang="ts">
	export let data

	const github_base_path = 'https://github.com/sinProject-Inc/talk/edit/main'
	const git_path = `${github_base_path}${data.file_path.slice(1)}`
</script>

<svelte:head>
	<title>{data.page.title} - sinProject Talk</title>
	<style>
		.content a {
			color: #fff;
			font-weight: 600;
			border-bottom: 1px solid #38bdf8;
		}

		.content a:hover {
			border-bottom: 2px solid #38bdf8;
		}
	</style>
</svelte:head>

<div class="text-slate-400">
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
</div>
