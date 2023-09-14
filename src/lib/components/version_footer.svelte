<script lang="ts">
	import { version } from '$app/environment'
	import { App } from '$lib/app/app'
</script>

<div class="glass-text-3 flex h-6 justify-center text-sm">
	<a
		target="_blank"
		rel="noreferrer"
		href="https://github.com/sinProject-Inc/talk/"
		class="hover:text-primary-10 dark:hover:text-primary-dark-4">{App.copyright} v{version}</a
	>
</div>
