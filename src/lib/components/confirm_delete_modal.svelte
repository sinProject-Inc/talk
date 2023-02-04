<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'

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

<div class="fixed top-0 left-0 w-full bg-black/30 h-full" on:click={close} on:keydown>
</div>

<div class="fixed top-0 left-0 w-full h-full justify-center items-center flex pointer-events-none">
  <div class="py-3 glass-panel pointer-events-auto px-5 text-center">
    <div class="font-bold text-lg mb-3">Confirm Delete</div>
    <div class="mb-4">Are you sure you want to delete this?</div>
    <div class="flex justify-center gap-4">
      <button class="glass-button bg-white/5 hover:bg-white/10 delete-cancel" on:click={close}>Cancel</button>
      <button class="glass-button text-red-400 delete-confirm" on:click={confirm_delete}>Delete</button>
    </div>
  </div>
</div>

