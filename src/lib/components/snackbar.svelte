<script lang="ts">
	import { fly } from 'svelte/transition'

	export let text: string
	export let visible = false
</script>

{#if visible}
	<div class="flex bottom-5 fixed center-container justify-center z-50">
		<div
			class="w-56 px-5 py-3 glass-panel text-xs"
			in:fly="{{ y: 200  }}"
			out:fly="{{ y: 100 }}"
			id="snackbar"
		>
			{text}
		</div>
	</div>
{/if}
