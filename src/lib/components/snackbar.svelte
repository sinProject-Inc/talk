<script lang="ts">
	import { fly } from 'svelte/transition'

	export let text: string
	export let visible = false
</script>

{#if visible}
	<div class="center-container fixed bottom-5 z-50 flex justify-center">
		<div
			class="glass-panel w-56 px-5 py-3 text-xs"
			in:fly={{ y: 200 }}
			out:fly={{ y: 100 }}
			id="snackbar"
		>
			{text}
		</div>
	</div>
{/if}
