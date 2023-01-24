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

<div class="root_container flex_row align_items_center justify_content_center height_page">
	<div class="center_container width_limit margin_bottom_128px">
			<form class="flex_column card padding_16px gap_8px align_items_center" method="POST" action="/pin-code?/sign_in&redirect_url={encoded_redirect_url}">
				<h1 class="title">{$_('sign_in')}</h1>
				<input
					class=""
					type="email"
					name="email"
					placeholder={$_('email')}
					required
					bind:this={pin_input_element}
				/>
				<button class="submit_button" type="submit">{$_('sign_in')}</button>
				<input type="hidden" name="translated_pin_code" value={$_('pin_code')} />
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

form > * {
	width: 100%;
	box-sizing: border-box;
}

.submit_button {
	background-color: rgb(29, 155, 240);
	color: white;
	font-weight: 600;
}

.margin_bottom_128px {
	margin-bottom: 128px;
}

</style>
