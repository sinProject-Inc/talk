<script lang="ts">
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import SignInIcon from '$lib/components/icons/sign_in_icon.svelte'
	import { createEventDispatcher } from 'svelte'
	import { _ } from 'svelte-i18n'
	import AnimationSwitcher from './animation_switcher.svelte'
	import GithubIcon from './icons/github_icon.svelte'
	import ProfileIcon from './icons/profile_icon.svelte'
	import SearchIcon from './icons/search_icon.svelte'
	import SignOutIcon from './icons/sign_out_icon.svelte'
	import NavItemTab from './nav_item_tab.svelte'
	import ThemeSwitcher from './theme_switcher.svelte'
	import VolumeSwitcher from './volume_switcher.svelte'

	export let is_on_docs = false

	const dispatch = createEventDispatcher()

	const encoded_redirect_url = encodeURIComponent($page.url.pathname)

	function on_search_button_click(): void {
		dispatch('show_search_modale')
	}
</script>

<div class="glass-text-5 sticky top-0 z-10 h-[var(--header-height)] bg-transparent backdrop-blur">
	<div
		class="mx-3 h-full border-b border-primary-9/[0.06] px-3 dark:border-primary-dark-9/[0.06] md:mx-0 md:px-6"
	>
		<div class="center-container flex h-full flex-row items-center gap-4 px-0 font-bold">
			<a href="{base}/" class="flex items-center gap-2 text-[22px] no-underline">
				<img src="{base}/icon-144.png" class="h-8" alt="" />
				{$_('talk_title')}
			</a>
			<nav class="ms-auto flex h-full items-center gap-5 text-sm font-semibold leading-6">
				<!-- <nav
				class="ms-auto flex items-center gap-5 text-sm font-semibold leading-6 dark:text-primary-dark-5 text-primary-5"
			> -->

				<NavItemTab name="translate" />
				<NavItemTab name="chat" />
				<NavItemTab name="docs" />

				{#if is_on_docs}
					<button
						on:click={on_search_button_click}
						class="glowing-icon"
						data-testid="navbar-search-button"
					>
						<div class="h-nav-icon"><SearchIcon /></div>
					</button>
					<VolumeSwitcher />
					<AnimationSwitcher />
				{/if}
				{#if $page.data.user}
					<ThemeSwitcher />
				{/if}
				<a
					href="https://github.com/sinProject-Inc/talk"
					target="_blank"
					class="flex items-center gap-1"
				>
					<div class="h-nav-icon"><GithubIcon /></div>
				</a>
				{#if $page.data.user}
					<a href="{base}/profile" class="flex items-center gap-1">
						<div class="h-nav-icon"><ProfileIcon /></div>
					</a>
					<form action="{base}/sign-out" method="POST">
						<button class="glowing-icon flex" type="submit">
							<SignOutIcon />
						</button>
					</form>
				{:else}
					<a
						class="flex flex-row items-center no-underline"
						href="{base}/sign-in?redirect_url={encoded_redirect_url}"
						><div class="h-nav-icon">
							<SignInIcon />
						</div>
					</a>
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
