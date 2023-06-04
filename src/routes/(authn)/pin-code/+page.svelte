<script lang="ts">
	import { enhance } from '$app/forms'
	import LoadingIcon from '$lib/components/icons/loading_icon.svelte'
	import { WebLogger } from '$lib/view/log/web_logger'
	import { onMount } from 'svelte'
	import { _ } from 'svelte-i18n'
	import type { ActionData } from './$types'

	export let form: ActionData

	let pin_input_element: HTMLInputElement

	let sending = false

	const web_logger = new WebLogger('pin-code')

	onMount(() => {
		web_logger.add_event_listeners()

		if (!form) location.href = '/sign-in'

		document.onfocus = (event): void => {
			if (event.target instanceof HTMLInputElement) event.target.select()
		}

		pin_input_element.select()
	})

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<svelte:head>
	<title>Talk - PIN code</title>
</svelte:head>

<div class="flex h-screen items-center justify-center">
	<div class="center-container card-parent">
		<form
			class="card glass-panel mx-3 mb-0 p-4 md:mb-40"
			method="POST"
			action="?/submit"
			use:enhance={() => {
				web_logger.info(
					`on_submit: email: ${form?.email_address}, pin_code: ${pin_input_element.value}`
				)
				sending = true

				return async ({ update }) => {
					await update()
					sending = false
				}
			}}
		>
			<div class="title w-full">
				<h1 class="mb-2">{$_('enter_pin_code')}</h1>
				<p class="glass-text-faint-sm break-words text-sm font-light">
					{$_('sent_pin_code', { values: { email: form?.email_address } })}
				</p>
			</div>
			<div class="mt-4 flex flex-col gap-3">
				<input type="hidden" name="email" value={form?.email_address} />
				<input
					class="focus:outline-link] input"
					type="text"
					name="pin_code"
					placeholder={$_('pin_code')}
					required
					bind:this={pin_input_element}
				/>

				{#if form?.missing}<p class="error">{$_('pin_code_is_required')}</p>{/if}
				{#if form?.credentials}<p class="error">{$_('wrong_credentials')}</p>{/if}

				<button class="glass-button flex flex-row justify-center" type="submit" disabled={sending}>
					{#if sending}
						<div class="w-6 animate-spin">
							<LoadingIcon />
						</div>
					{:else}
						{$_('submit')}
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
