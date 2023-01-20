<script lang="ts">
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte'
	import type { ActionData } from './$types'
	import { _ } from 'svelte-i18n'
	import '../../app.css'

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

<h1>　{$_('enter_pin_code')}</h1>

We’ve sent a 6-character code to {form?.email}. The code expires shortly, so please enter it soon.

<form method="POST" action="?/submit" use:enhance>
	<input type="hidden" name="email" value={form?.email} />
	<input type="text" name="pin_code" placeholder={$_('pin_code')} required bind:this={pin_input_element} />

	{#if form?.missing}<p class="error">{$_('pin_code_is_required')}</p>{/if}
	{#if form?.credentials}<p class="error">{$_('wrong_credentials')}</p>{/if}

	<button type="submit">{$_('submit')}</button>
</form>