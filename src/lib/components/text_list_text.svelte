<script lang="ts">
	import IconButton from '$lib/components/icon_button.svelte'
	import CloseIcon from '$lib/components/icons/close_icon.svelte'
	import type { Text } from '@prisma/client'

	export let texts: Text[]
	export let text: Text
	export let i: number
	export let selected_text: Text | undefined = undefined
	export let deletable = false
	export let text_direction = 'ltr'
	export let delete_text: (text: Text) => void = () => {
		return
	}

	$: selected = selected_text === text
	$: is_last_text = i === texts.length - 1

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<div
	class="text group cursor-pointer transition
		{deletable ? 'ltr:pl-5 rtl:pr-5' : 'px-5'}
		flex justify-between break-all hover:bg-primary-5/5 dark:hover:bg-primary-dark-5/5
		{selected ? ' bg-primary-5/5 dark:bg-primary-dark-5/5' : 'bg-inherit'}
		{is_last_text ? 'rounded-b-md' : ''}"
	id={text.id.toString()}
>
	<div
		class="text-body w-full py-[10px]"
		on:click
		on:keydown
		role="button"
		tabindex="0"
		dir={text_direction}
	>
		<p class="whitespace-pre-wrap">{text.text}</p>
	</div>
	{#if deletable}
		<div class="delete-button invisible my-1 w-6 group-hover:visible ltr:mr-7 rtl:ml-7">
			<IconButton on:click={() => delete_text(text)}><CloseIcon /></IconButton>
		</div>
	{/if}
</div>
