<script lang="ts">
	import { theme } from '$lib/stores'
	import { get } from 'svelte/store'
	import MoonIcon from './icons/moon_icon.svelte'
	import SunIcon from './icons/sun_icon.svelte'

	function handle_click(): void {
		theme.set(get(theme) === 'dark' ? 'light' : 'dark')
	}

	$: title = $theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
</script>

<button class="glowing-icon" on:click={handle_click} {title}>
	{#if $theme === 'dark'}
		<MoonIcon />
	{:else}
		<SunIcon />
	{/if}
</button>
