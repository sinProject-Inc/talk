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

<div class="flex items-center justify-center h-screen">
	<div class="center-container card-parent">
		<form
			class="md:mb-40 mb-0 card glass-panel p-4 mx-3"
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
				<p class="font-light text-sm text-white/70 break-words">
					{$_('sent_pin_code', { values: { email: form?.email_address } })}
				</p>
			</div>
			<div class="flex-col flex gap-3 mt-4">
				<input type="hidden" name="email" value={form?.email_address} />
				<input
					class="focus:outline-link]"
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
						<div class="animate-spin w-6">
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
