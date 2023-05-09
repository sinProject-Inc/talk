<script lang="ts">
	import { page } from '$app/stores'
	import { _ } from 'svelte-i18n'
	import SignInIcon from '$lib/components/icons/sign_in_icon.svelte'
	import ChatIcon from './icons/message-chatbot_icon.svelte'
	import DocumentIcon from './icons/book_icon.svelte'
	import TranslateIcon from './icons/language-hiragana_icon.svelte'
	import SignOutIcon from './icons/sign_out_icon.svelte'
	import GithubIcon from './icons/github_icon.svelte'
	import SearchIcon from './icons/search_icon.svelte'
	import { createEventDispatcher } from 'svelte'

	export let search_bar_enabled = false

	const dispatch = createEventDispatcher()

	const encoded_redirect_url = encodeURIComponent($page.url.pathname)

	function on_search_button_click(): void {
		dispatch('show_search_modale')
	}
</script>

<div class="sticky z-10 h-[var(--header-height)] top-0 backdrop-blur bg-transparent">
	<div class="h-full border-b border-slate-50/[0.06] md:mx-0 md:px-6 mx-6">
		<div class="center-container flex flex-row gap-4 items-center font-bold h-full px-0">
			<a href="/" class="text-[22px] no-underline header-text-color title flex gap-2 items-center">
				<img src="/icon-144.png" class="h-8" alt="" />
				{$_('talk_title')}
			</a>
			<nav
				class="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200 ms-auto flex gap-5 items-center"
			>
				<a href="/translate" class="flex gap-1 items-center">
					<div class="h-5"><TranslateIcon /></div>
					<span class="hidden md:block">{$_('translate')}</span>
				</a>
				<a href="/chat" class="flex gap-1 items-center"
					><div class="h-5"><ChatIcon /></div>
					<span class="hidden md:block">{$_('chat')}</span></a
				>
				<a href="/docs" class="flex gap-1 items-center"
					><div class="h-5"><DocumentIcon /></div>
					<span class="hidden md:block">Docs</span></a
				>
				{#if search_bar_enabled}
					<button
						on:click={on_search_button_click}
						class="button flex gap-1 items-center px-0"
						data-testid="navbar-search-button"
					>
						<div class="h-5"><SearchIcon /></div>
					</button>
				{/if}
				<a
					href="https://github.com/sinProject-Inc/talk"
					target="_blank"
					class="flex gap-1 items-center"
				>
					<div class="h-5"><GithubIcon /></div>
				</a>
				{#if $page.data.user}
					<form action="/sign-out" method="POST">
						<button class="no-underline h-5 p-0 flex button" type="submit">
							<SignOutIcon />
						</button>
					</form>
				{:else}
					<a
						class="flex flex-row items-center no-underline"
						href="/sign-in?redirect_url={encoded_redirect_url}"
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
