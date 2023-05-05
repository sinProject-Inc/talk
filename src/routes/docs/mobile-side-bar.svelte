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
	class="fixed top-0 left-0 w-screen h-screen pointer-events-auto z-10"
	on:click={close}
	on:keydown
/>

<div
	class="fixed top-0 left-0 w-full h-full justify-center flex pointer-events-none z-20 backdrop-blur-sm pr-20"
>
	<div
		class="rounded-none glass-panel bg-slate-900/90 backdrop-blur-md pointer-events-auto items-start pl-10 w-80 min-h-screen border-0 mr-auto"
	>
		<div class="overflow-y-scroll h-screen side-bar-navigation w-full">
			<SideBar {sections} search_bar_enabled={false} />
			<IconButton class="absolute top-6 right-6" on:click={close}>
				<CloseIcon />
			</IconButton>
		</div>
	</div>
</div>
