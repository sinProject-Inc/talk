<script lang="ts">
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import SignInIcon from '$lib/components/icons/sign_in_icon.svelte'
	import { createEventDispatcher } from 'svelte'
	import { _ } from 'svelte-i18n'
	import GithubIcon from './icons/github_icon.svelte'
	import ProfileIcon from './icons/profile_icon.svelte'
	import SearchIcon from './icons/search_icon.svelte'
	import SignOutIcon from './icons/sign_out_icon.svelte'
	import NavItemTab from './nav_item_tab.svelte'
	import DropdownMenu from './dropdown_menu.svelte'

	export let search_bar_enabled = false

	const dispatch = createEventDispatcher()

	const encoded_redirect_url = encodeURIComponent($page.url.pathname)

	function on_search_button_click(): void {
		dispatch('show_search_modale')
	}
</script>

<div class="glass-text-5 sticky top-0 z-10 h-[var(--header-height)] bg-transparent backdrop-blur">
	<div
		class="mx-6 h-full border-b border-primary-9/[0.06] dark:border-primary-9/[0.06] md:mx-0 md:px-6"
	>
		<div class="center-container flex h-full flex-row items-center gap-4 px-0 font-bold">
			<a href="{base}/" class="flex items-center gap-2 text-[22px] no-underline">
				<img src="{base}/icon-144.png" class="h-8" alt="" />
				{$_('talk_title')}
			</a>
			<nav class="ms-auto flex h-full items-center gap-5 text-sm font-semibold leading-6">
				<!-- <nav
				class="ms-auto flex items-center gap-5 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200"
			> -->

				<NavItemTab name="translate" />
				<NavItemTab name="chat" />
				<NavItemTab name="docs" />

				{#if search_bar_enabled}
					<button
						on:click={on_search_button_click}
						class="button flex items-center gap-1 px-0"
						data-testid="navbar-search-button"
					>
						<div class="h-5"><SearchIcon /></div>
					</button>
				{/if}
				<DropdownMenu />
				<a
					href="https://github.com/sinProject-Inc/talk"
					target="_blank"
					class="flex items-center gap-1"
				>
					<div class="h-5"><GithubIcon /></div>
				</a>
				{#if $page.data.user}
					<a href="{base}/profile" class="flex items-center gap-1">
						<div class="h-5"><ProfileIcon /></div>
					</a>
					<form action="{base}/sign-out" method="POST">
						<button class="button flex h-5 p-0 no-underline" type="submit">
							<SignOutIcon />
						</button>
					</form>
				{:else}
					<a
						class="flex flex-row items-center no-underline"
						href="{base}/sign-in?redirect_url={encoded_redirect_url}"
						><div class="h-5">
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
		@apply hover:text-sky-500 dark:hover:text-sky-400;
	}

	.button {
		@apply hover:text-sky-500 dark:hover:text-sky-400;
	}
</style>
