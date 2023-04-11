<script lang="ts">
	import { page } from '$app/stores'
	import { _ } from 'svelte-i18n'
	import SignInIcon from '$lib/components/icons/sign_in_icon.svelte'

	const encoded_redirect_url = encodeURIComponent($page.url.pathname)

	console.log(encoded_redirect_url)
</script>

<div class="flex flex-row sticky z-10 h-[53px] top-0 glass-panel rounded-none">
	<div class="center-container flex flex-row gap-4">
		<a
			href="/"
			class="text-[22px] font-bold flex flex-row items-center flex-1 no-underline header-text-color"
			>{$_('talk_title')}</a
		>

		{#if $page.data.user}
			<div class="ml-auto flex gap-4 items-center">
				<div>{$page.data.user.email}</div>
				<form action="/sign-out" method="POST">
					<button class="glass-button no-underline" type="submit">{$_('sign_out')}</button>
				</form>
			</div>
		{:else}
			<div class="ml-auto flex gap-2">
				<a
					class="flex flex-row items-center no-underline"
					href="/sign-in?redirect_url={encoded_redirect_url}"
					><button class="flex flex-row gap-1 items-center glass-button pr-5">
						<div class="flex flex-row justify-center h-5">
							<SignInIcon />
						</div>
						<div>{$_('sign_in')}</div>
					</button></a
				>
			</div>
		{/if}
	</div>
</div>
