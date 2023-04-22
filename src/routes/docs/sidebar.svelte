<script lang="ts">
	import type { Section } from '$lib/view/markdown'

	export let sections: Section[] = []
</script>

<ul>
	{#each sections as section}
		<li>
			{section.title}
			<ul>
				{#each section.pages as page}
					<li>
						<a href={page.path}>
							{page.title}
						</a>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
