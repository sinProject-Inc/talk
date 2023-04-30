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

<div class="bg-fixed min-h-screen bg-no-repeat bg-cover" dir={get_direction($locale ?? '')}>
	<div>
		{#if current_background}
			<div class="fixed w-full h-screen -z-50">
				<div
					style="background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url({next_background.background_url}) bottom center/cover"
					class="absolute w-full h-full pointer-events-none bg-fixed min-h-screen bg-no-repeat bg-cover"
					aria-hidden="true"
				/>
				<div
					class="{transitioning_background
						? 'opacity-0 transition-all'
						: 'opactiy-100'}  absolute w-full h-full pointer-events-none bg-fixed min-h-screen bg-no-repeat bg-cover"
					style=" background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url({current_background.background_url}) bottom center/cover; transition-duration: {transitioning_background
						? background_transition_duration
						: 0}ms"
					aria-hidden="true"
				/>
			</div>
		{/if}
	</div>
	<slot />
</div>
