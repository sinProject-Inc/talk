<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { _ } from 'svelte-i18n'

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

<div class="flex items-center justify-center h-screen">
	<div class="center-container card-parent">
			<form class="md:mb-40 mb-0 card p-4 mx-3 glass-panel" method="POST" action="/pin-code?/sign_in&redirect_url={encoded_redirect_url}">
				<div class="title w-full">
					<h1 class="mb-2">{$_('sign_in')}</h1>
					<h2 class="font-light text-sm text-white/70">{$_('or_create_account')}</h2>
				</div>
				<div class="flex-col flex gap-3 mt-4">
					<input
						class=""
						type="email"
						name="email"
						placeholder={$_('email')}
						required
						bind:this={pin_input_element}
					/>
					<button class="glass-button" type="submit">{$_('continue')}</button>
					<input type="hidden" name="translated_pin_code" value={$_('pin_code')} />
				</div>
			</form>
	</div>
</div>