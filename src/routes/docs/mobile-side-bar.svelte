<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte'
	import SideBar from './side-bar.svelte'
	import type { Section } from '$lib/docs/markdown'
	import CloseIcon from '$lib/components/icons/close_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'

	export let sections: Section[]

	const dispatch = createEventDispatcher()

	function close(): void {
		release_scroll()
		dispatch('close')
	}

	function handle_keydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			close()
		}
	}

	function handle_scroll(event: WheelEvent): void {
		const target = event.target
		const delta_y = event.deltaY

		if (!(target instanceof HTMLElement)) return

		if (results_div_has_overflow(target, delta_y)) return

		event.preventDefault()
	}

	function release_scroll(): void {
		window.removeEventListener('wheel', handle_scroll)
	}

	function results_div_has_overflow(target: HTMLElement, delta_y: number): boolean {
		let scroll_height = 0
		let client_height = 0
		let scroll_top = 0

		const target_parent = target.closest('.side-bar-navigation')

		if (target_parent) {
			scroll_height = target_parent.scrollHeight
			client_height = target_parent.clientHeight
			scroll_top = target_parent.scrollTop
		}

		if (scroll_top === 0 && delta_y < 0) return false
		if (scroll_top + client_height === scroll_height && delta_y > 0) return false

		return true
	}

	onMount(() => {
		window.addEventListener('wheel', handle_scroll, { passive: false })
	})

	onDestroy(() => {
		release_scroll()
	})

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<svelte:window on:keydown={handle_keydown} />

<div
	class="pointer-events-auto fixed left-0 top-0 z-10 h-screen w-screen"
	on:click={close}
	on:keydown
/>

<div class="pointer-events-none fixed left-0 top-0 z-20 flex h-full w-full justify-center pr-20">
	<div
		class="glass-panel pointer-events-auto mr-auto min-h-screen w-80 items-start rounded-none border-0 bg-slate-900/90 pl-10"
	>
		<div class="side-bar-navigation h-screen w-full overflow-y-scroll">
			<SideBar {sections} search_bar_enabled={false} />
			<IconButton class="absolute right-6 top-6" on:click={close}>
				<CloseIcon />
			</IconButton>
		</div>
	</div>
</div>
