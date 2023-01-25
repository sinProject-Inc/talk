<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { _ } from 'svelte-i18n'
	import '../../app.css'

	let pin_input_element: HTMLInputElement

	const redirect_url = $page.url.searchParams.get('redirect_url') ?? ''
	const encoded_redirect_url = encodeURIComponent(redirect_url)

	onMount(() => {
		document.onfocus = (event): void => {
			if (event.target instanceof HTMLInputElement) event.target.select()
		}

		pin_input_element.select()
	})
</script>

<div class="root_container flex items-center justify-center h-screen">
	<div class="center_container width_limit">
			<form class="md:mb-40 mb-0 pb-4 py-2 card p-4 mx-3" method="POST" action="/pin-code?/sign_in&redirect_url={encoded_redirect_url}">
				<div class="title w-full">
					<h1 class="mb-2">{$_('sign_in')}</h1>
					<h2 class="font-light text-sm text-black/60">{$_('or_create_account')}</h2>
				</div>
				<div class="flex-col flex gap-3 mt-4">
					<input
						class="focus:outline-[#1d9bf0]"
						type="email"
						name="email"
						placeholder={$_('email')}
						required
						bind:this={pin_input_element}
					/>
					<button class="submit_button" type="submit">{$_('continue')}</button>
					<input type="hidden" name="translated_pin_code" value={$_('pin_code')} />
				</div>
			</form>
	</div>
</div>

<style>
	.width_limit {
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	max-width: calc(500px + 2rem);
}

form > input {
	width: 100%;
	box-sizing: border-box;
	height: 32px;
}
</style>
