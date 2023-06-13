<script lang="ts">
	import PauseIcon from '$lib/components/icons/pause_icon.svelte'
	import PlayIcon from '$lib/components/icons/play_icon.svelte'
	import { get } from 'svelte/store'
	import { animations_enabled } from '$lib/stores'

	function handle_click(): void {
		animations_enabled.set(!get(animations_enabled))
	}

	$: title = $animations_enabled ? 'Disable animations' : 'Enable animations'
</script>

<button class="glowing-icon" on:click={handle_click} {title}>
	{#if $animations_enabled}
		<PlayIcon />
	{:else}
		<PauseIcon />
	{/if}
</button>
