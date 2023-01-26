<script lang="ts">
	import { page } from '$app/stores'
	import { _ } from 'svelte-i18n'
	import SignInIcon from '$lib/components/icons/sign_in_icon.svelte'
</script>

<div class="flex_row root_container header header_background_color">
	<div class="center_container flex_row">
		<div class="header_left flex_row align_items_center">{$_('talk_title')}</div>

		{#if $page.data.user}
			<div class="header_right flex gap-2 items-center">
				<div>{$page.data.user.email}</div>
				<form action="/sign-out" method="POST">
					<button type="submit">{$_('sign_out')}</button>
				</form>
			</div>
		{:else}
			<div class="header_right flex gap-2">
				<a class="flex_row align_items_center sign_in_button" href="/sign-in"
					><div class="flex_row gap-1 items-center bg-white">
						<div class="flex_row justify_content_center h-5">
							<SignInIcon />
						</div>
						<div>{$_('sign_in')}</div>
					</div></a
				>
			</div>
		{/if}
	</div>
</div>
