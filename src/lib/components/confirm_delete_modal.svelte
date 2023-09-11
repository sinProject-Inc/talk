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
		release_scroll()
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

<div
	class="fixed left-0 top-0 h-full w-full bg-black/30"
	on:click={close}
	on:keydown
	role="button"
	tabindex="0"
/>

<div
	class="pointer-events-none fixed left-0 top-0 flex h-full w-full items-center justify-center px-4"
>
	<div
		class="glass-panel pointer-events-auto mx-auto w-full max-w-[calc(370px+2rem)] pb-8 pt-6 text-center"
	>
		<div class="px-4 sm:px-8">
			<div class="mb-5 text-lg font-bold">{$_('confirm_delete')}</div>
			<div class="mb-8">{$_('are_you_sure')}</div>
			<div class="flex justify-center gap-4">
				<button
					class="glass-button delete-cancel flex w-full justify-center gap-2 dark:bg-primary-dark-5/5 hover:dark:bg-primary-dark-5/10"
					on:click={close}
				>
					<div class="w-6"><CloseIcon /></div>
					{$_('cancel')}
				</button>
				<button
					class="glass-button delete-confirm flex w-full justify-center gap-2 bg-red-400/60 text-base hover:bg-red-500/60 dark:bg-primary-9/50 dark:!text-red-400"
					on:click={confirm_delete}
				>
					<div class="w-6"><CheckIcon /></div>
					{$_('delete')}
				</button>
			</div>
		</div>
	</div>
</div>
