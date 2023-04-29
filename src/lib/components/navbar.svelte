<script lang="ts">
	import { page } from '$app/stores'
	import { _ } from 'svelte-i18n'
	import SignInIcon from '$lib/components/icons/sign_in_icon.svelte'
	import SnsIcon from './icons/sns_icon.svelte'
	import DescriptionIcon from './icons/description_icon.svelte'
	import TranslateIcon from './icons/translate_icon.svelte'

	const encoded_redirect_url = encodeURIComponent($page.url.pathname)
</script>

<div class="flex flex-row sticky z-10 h-[53px] top-0 glass-panel rounded-none">
	<div class="center-container flex flex-row gap-4 items-center font-bold">
		<a href="/" class="text-[22px] no-underline header-text-color title flex gap-2 items-center">
			<img src="/icon-144.png" class="h-8" />
			{$_('talk_title')}
		</a>

		{#if $page.data.user}
			<div class="ms-auto flex gap-4 items-center">
				<!-- <div>{$page.data.user.email}</div> -->
				<form action="/sign-out" method="POST">
					<button class="glass-button no-underline" type="submit">{$_('sign_out')}</button>
				</form>
			</div>
		{:else}
			<nav
				class="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200 ms-auto flex gap-4 items-center"
			>
				<a href="/translate" class="flex gap-1 items-center">
					<div class="h-4"><TranslateIcon /></div>
					{$_('translate')}
				</a>

				<a href="/chat" class="flex gap-1 items-center"
					><div class="h-4"><SnsIcon /></div>
					{$_('chat')}</a
				>

				<a href="/docs" class="flex gap-1 items-center"
					><div class="h-4"><DescriptionIcon /></div>
					Docs</a
				>

				<a
					class="flex flex-row items-center no-underline"
					href="/sign-in?redirect_url={encoded_redirect_url}"
					><div class="h-5">
						<SignInIcon />
					</div>
				</a>
			</nav>
		{/if}
	</div>
</div>

<style lang="postcss">
	a:not(.title) {
		@apply hover:text-sky-500 dark:hover:text-sky-400;
	}
</style>
