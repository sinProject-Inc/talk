<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { _ } from 'svelte-i18n'
	import CheckIcon from './icons/check_icon.svelte'
	import CloseIcon from './icons/close_icon.svelte'

	const dispatch = createEventDispatcher()

	function close(): void {
		release_scroll()
		dispatch('close')
	}

	function confirm_delete(): void {
		dispatch('confirm_delete')
		dispatch('close')
	}

	function handle_keydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			close()
			return
		}
	}

	function handle_scroll(event: WheelEvent): void {
		event.preventDefault()
	}

	function release_scroll(): void {
		document.removeEventListener('wheel', handle_scroll)
	}

	onMount(() => {
		document.addEventListener('wheel', handle_scroll, { passive: false })
	})
</script>

<svelte:window on:keydown={handle_keydown} />

<div class="fixed top-0 left-0 w-full bg-black/30 h-full" on:click={close} on:keydown />

<div class="fixed top-0 left-0 w-full h-full justify-center items-center flex pointer-events-none ">
	<div
		class="pt-9 pb-10 glass-panel pointer-events-auto px-10 text-center mx-auto max-w-[calc(370px+2rem)] w-full"
	>
		<div class="font-bold text-lg mb-5">{$_('confirm_delete')}</div>
		<div class="mb-8">{$_('are_you_sure')}</div>
		<div class="flex justify-center gap-4">
			<button
				class="glass-button bg-white/5 hover:bg-white/10 delete-cancel w-full flex justify-center gap-2"
				on:click={close}
			>
				<div class="w-6"><CloseIcon /></div>
				{$_('cancel')}
			</button>
			<button
				class="glass-button text-red-400 delete-confirm w-full flex justify-center gap-2"
				on:click={confirm_delete}
			>
				<div class="w-6"><CheckIcon /></div>
				{$_('delete')}
			</button>
		</div>
	</div>
</div>
