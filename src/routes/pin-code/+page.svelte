<script lang="ts">
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte'
	import type { ActionData } from './$types'
	import { _ } from 'svelte-i18n'

	export let form: ActionData

	let pin_input_element: HTMLInputElement

	onMount(() => {
	    if (!form) location.href = '/sign-in'
	
		document.onfocus = (event): void => {
			if (event.target instanceof HTMLInputElement) event.target.select()
		}

		pin_input_element.select()
	})
</script>

<div class="flex items-center justify-center h-screen">
	<div class="center-container card-parent">
			<form class="md:mb-40 mb-0 card glass-panel p-4 mx-3" method="POST" action="?/submit" use:enhance>
				<div class="title w-full">
					<h1 class="mb-2">{$_('enter_pin_code')}</h1>
					<p class="font-light text-sm text-white/70 break-words">
						{$_('sent_pin_code', { values: { email: form?.email_address }})}
				</div>
				<div class="flex-col flex gap-3 mt-4">
					<input type="hidden" name="email" value={form?.email_address} />
					<input class="focus:outline-link]" type="text" name="pin_code" placeholder={$_('pin_code')} required bind:this={pin_input_element} />
				
					{#if form?.missing}<p class="error">{$_('pin_code_is_required')}</p>{/if}
					{#if form?.credentials}<p class="error">{$_('wrong_credentials')}</p>{/if}
				
					<button class="glass-button" type="submit">{$_('submit')}</button>
				</div>
			</form>
	</div>
</div>