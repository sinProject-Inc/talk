<script lang="ts">
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import LoadingIcon from '$lib/components/icons/loading_icon.svelte'
	import { WebLogger } from '$lib/view/log/web_logger'
	import { onMount } from 'svelte'
	import { _ } from 'svelte-i18n'

	let email_input_element: HTMLInputElement

	const redirect_url = $page.url.searchParams.get('redirect_url') ?? ''
	const encoded_redirect_url = encodeURIComponent(redirect_url)

	let sending = false

	const web_logger = new WebLogger('sign_in')

	function on_submit(): void {
		web_logger.info(`on_submit: email: ${email_input_element.value}`)
		sending = true
	}

	onMount(() => {
		web_logger.add_event_listeners()

		document.onfocus = (event): void => {
			if (event.target instanceof HTMLInputElement) event.target.select()
		}

		email_input_element.select()
	})
</script>

<svelte:head>
	<title>Talk - Sign in</title>
</svelte:head>

<div class="flex items-center justify-center h-screen">
	<div class="center-container card-parent">
		<form
			class="md:mb-40 mb-0 card p-4 mx-3 glass-panel"
			method="POST"
			action="{base}/pin-code?/sign_in&redirect_url={encoded_redirect_url}"
			on:submit={on_submit}
		>
			<div class="title w-full">
				<h1 class="mb-2">{$_('sign_in')}</h1>
				<h2 class="font-light text-sm text-white/70">{$_('or_create_account')}</h2>
			</div>

			<div class="flex-col flex gap-3 mt-4">
				<input
					type="email"
					name="email"
					placeholder={$_('email')}
					required
					bind:this={email_input_element}
				/>

				<button class="glass-button flex flex-row justify-center" type="submit" disabled={sending}>
					{#if sending}
						<div class="animate-spin w-6">
							<LoadingIcon />
						</div>
					{:else}
						{$_('continue')}
					{/if}
				</button>
				<input type="hidden" name="translated_pin_code" value={$_('pin_code')} />
			</div>
		</form>
	</div>
</div>
