<script lang="ts">
	export let data
</script>

<svelte:head>
	<title>{data.page.title} - sinProject Talk</title>
</svelte:head>

<p class="category">{data.category}</p>
<h1>{data.page.title}</h1>
{#if data.page.description}
	<span>{data.page.description}</span>
{/if}

{@html data.page.html_content}
