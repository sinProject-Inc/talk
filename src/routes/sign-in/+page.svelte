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

<h1>{$_('sign_in')} / {$_('sign_up')}</h1>

<div class="flex_column">
	<form method="POST" action="/pin_code?/sign_in&redirect_url={encoded_redirect_url}">
		<input type="email" name="email" placeholder="$_('email')" required bind:this={pin_input_element} />

		<button type="submit">{$_('sign_in')} / {$_('sign_up')}</button>
	</form>
</div>
