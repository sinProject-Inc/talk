<script lang="ts">
	// import { onMount } from 'svelte'
	import VolumeOffIcon from './icons/volume_off_icon.svelte'
	import VolumeOnIcon from './icons/volume_on_icon.svelte'
	import { get } from 'svelte/store'
	import { volume_enabled } from '$lib/stores'

	function handle_click(): void {
		volume_enabled.set(!get(volume_enabled))
	}
</script>

<button class="glowing-icon" on:click={handle_click}>
	{#if $volume_enabled}
		<VolumeOnIcon />
	{:else}
		<VolumeOffIcon />
	{/if}
</button>
