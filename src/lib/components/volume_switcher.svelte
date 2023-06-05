<script lang="ts">
	// import { onMount } from 'svelte'
	import VolumeOffIcon from './icons/volume_off_icon.svelte'
	import VolumeOnIcon from './icons/volume_on_icon.svelte'
	import { get } from 'svelte/store'
	import { volume_on } from '$lib/stores'

	function toggle(): void {
		volume_on.set(!get(volume_on))
	}
</script>

<button class="glowing-icon" on:click={toggle}>
	{#if $volume_on}
		<VolumeOnIcon />
	{:else}
		<VolumeOffIcon />
	{/if}
</button>
