<script lang="ts">
	import SunIcon from './icons/sun_icon.svelte'
	import MoonIcon from './icons/moon_icon.svelte'
	import { get } from 'svelte/store'
	import { theme } from '$lib/stores'

	function handle_click(): void {
		theme.set(get(theme) === 'dark' ? 'light' : 'dark')
	}
</script>

<button class="glowing-icon" on:click={handle_click}>
	{#if $theme === 'dark'}
		<MoonIcon />
	{:else}
		<SunIcon />
	{/if}
</button>
