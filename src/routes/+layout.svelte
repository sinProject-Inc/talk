<script lang="ts">
	import { navigating } from '$app/stores'
	import '$lib/app.css'
	import { Direction } from '$lib/view/direction'
	import NProgress from 'nprogress'
	import 'nprogress/nprogress.css'
	import { locale } from 'svelte-i18n'
	import type { LayoutServerData } from './$types'
	import { onMount } from 'svelte'
	import { Background } from '$lib/background/background'
	import { browser } from '$app/environment'

	export let data: LayoutServerData

	const background_period_duration = data.background_period_duration
	const background_transition_duration = data.background_transition_duration
	let current_background: Background
	let next_background: Background
	let transitioning_background = false

	load_backgrounds()

	function get_direction(locale_code: string): string {
		return new Direction(locale_code).value
	}

	NProgress.configure({ showSpinner: false })

	$: {
		if ($navigating) {
			NProgress.start()
		} else {
			NProgress.done()
		}
	}

	async function transition_background(): Promise<void> {
		transitioning_background = true

		await new Promise((resolve) => setTimeout(resolve, background_transition_duration))
		current_background = current_background.transition_background()

		transitioning_background = false

		next_background = next_background.transition_background()
	}

	function load_backgrounds(): void {
		if (!browser) return

		current_background = Background.from_local_storage()
		next_background = current_background.get_next_background()
	}

	onMount(() => {
		current_background.transition_background()
		next_background = current_background.get_next_background()

		const interval = setInterval(() => {
			transition_background()
		}, background_period_duration)

		return (): void => clearInterval(interval)
	})
</script>

<div
	class="bg-fixed min-h-screen bg-no-repeat bg-cover"
	style="background-image: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35))"
	dir={get_direction($locale ?? '')}
>
	<!-- <div class="shadow-in flex fixed min-h-screen w-full flex-col backdrop-blur-md backdrop-filter">
	</div> -->

	<div>
		{#if current_background}
			<img
				src={next_background.background_url}
				class="absolute w-full h-full pointer-events-none"
				alt="background"
				aria-hidden="true"
			/>
			<img
				src={current_background.background_url}
				class="{transitioning_background
					? 'opacity-0 transition-all'
					: 'opactiy-100'}  absolute w-full h-full pointer-events-none"
				style="transition-duration: {transitioning_background
					? background_transition_duration
					: 0}ms"
				alt="background"
				aria-hidden="true"
			/>
		{/if}
	</div>
	<slot />
</div>
