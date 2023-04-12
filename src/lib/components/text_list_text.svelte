<script lang="ts">
	import IconButton from '$lib/components/icon_button.svelte'
	import CloseIcon from '$lib/components/icons/close_icon.svelte'
	import type { Text } from '@prisma/client'

	export let texts: Text[]
	export let text: Text
	export let i: number
	export let selected_text: Text | undefined = undefined
	export let on_click_text: (text: Text) => void
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
	class="group text cursor-pointer transition
		{deletable ? 'ltr:pl-5 rtl:pr-5' : 'px-5'}
		hover:bg-white/10 break-all flex justify-between
		{selected ? 'bg-white/10' : 'bg-inherit'}
		{is_last_text ? 'rounded-b-md' : ''}"
	id={text.id.toString()}
>
	<div
		class="text-body py-[10px] w-full"
		on:click={() => on_click_text(text)}
		on:keydown
		dir={text_direction}
	>
		{text.text}
	</div>
	{#if deletable}
		<div
			class="w-6 fill-white/30 ltr:mr-7 rtl:ml-7 my-1 invisible group-hover:visible delete-button"
		>
			<IconButton on_click_handler={() => delete_text(text)}><CloseIcon /></IconButton>
		</div>
	{/if}
</div>
