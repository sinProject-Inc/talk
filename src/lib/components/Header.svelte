<script lang="ts">
	import { page } from '$app/stores'
	import { _ } from 'svelte-i18n'
	import SignInIcon from '$lib/components/icons/sign_in_icon.svelte'
</script>

<div class="flex flex-row bg-header-background sticky z-10 h-[53px] top-0 backdrop-blur-md">
	<div class="center-container flex flex-row">
		<div class="text-[22px] font-bold px-4 flex flex-row items-center">{$_('talk_title')}</div>

		{#if $page.data.user}
			<div class="px-4 ml-auto flex gap-2 items-center">
				<div>{$page.data.user.email}</div>
				<form action="/sign-out" method="POST">
					<button type="submit">{$_('sign_out')}</button>
				</form>
			</div>
		{:else}
			<div class="px-4 ml-auto flex gap-2">
				<a class="flex flex-row items-center" href="/sign-in"
					><button class="flex flex-row gap-1 items-center bg-white pr-3">
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
