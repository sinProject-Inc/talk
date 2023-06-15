<script lang="ts">
	import { base } from '$app/paths'
	import { App } from '$lib/app/app'
	import { mobile_menu_open } from '$lib/stores'
	import { createEventDispatcher, onMount } from 'svelte'
	import AnimationSwitcher from './animation_switcher.svelte'
	import DotIcon from './icons/dot_icon.svelte'
	import SearchIcon from './icons/search_icon.svelte'
	import MenuItemsSub from './menu_items_sub.svelte'
	import NavItemTab from './nav_item_tab.svelte'
	import ThemeSwitcher from './theme_switcher.svelte'
	import VolumeSwitcher from './volume_switcher.svelte'

	export let is_on_docs = false

	const dispatch = createEventDispatcher()

	function on_search_button_click(): void {
		dispatch('show_search_modale')
	}

	let is_tablet = false

	onMount(() => {
		const media_query = window.matchMedia('(min-width: 768px)')
		const handle_media_change = (e: MediaQueryListEvent): boolean => (is_tablet = e.matches)
		media_query.addEventListener('change', handle_media_change)

		is_tablet = media_query.matches

		return (): void => {
			media_query.removeEventListener('change', handle_media_change)
		}
	})

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<div class="glass-text-5 sticky top-0 z-10 h-[var(--header-height)] bg-transparent backdrop-blur">
	<div
		class="mx-3 h-full border-b border-primary-9/[0.06] px-3 dark:border-primary-dark-9/[0.06] md:mx-0 md:px-6"
	>
		<div class="center-container flex h-full flex-row items-center gap-4 px-0 font-bold">
			<a href="{base}/" class="flex items-center gap-2 text-[22px] no-underline">
				<img src="{base}/icon-144.png" width="32" height="32" alt="" />
				{App.app_name}
			</a>
			<nav class="ms-auto flex h-full items-center gap-5 text-sm font-semibold leading-6">
				<!-- <nav
				class="ms-auto flex items-center gap-5 text-sm font-semibold leading-6 dark:text-primary-dark-5 text-primary-5"
			> -->

				<div class="hidden md:contents">
					<NavItemTab name="translate" />
					<NavItemTab name="chat" />
					<NavItemTab name="docs" />
				</div>

				{#if is_on_docs}
					<button
						title="Search"
						on:click={on_search_button_click}
						class="glowing-icon"
						data-testid="navbar-search-button"
					>
						<div class="h-nav-icon"><SearchIcon /></div>
					</button>
					<VolumeSwitcher />
					<AnimationSwitcher />
				{/if}
				<ThemeSwitcher />

				{#if is_tablet}
					<MenuItemsSub />
				{:else}
					<div class="h-5">
						<button
							class="glowing-icon"
							title="More"
							on:click={() => {
								$mobile_menu_open = true
							}}
						>
							<DotIcon />
						</button>
					</div>
				{/if}
			</nav>
		</div>
	</div>
</div>

<style lang="postcss">
	a:not(.title) {
		@apply hover:text-secondary dark:hover:text-secondary-dark;
	}
</style>
