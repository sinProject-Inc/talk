<script lang="ts">
	import { navigating } from '$app/stores'
	import '$lib/app.css'
	import { Direction } from '$lib/view/direction'
	import NProgress from 'nprogress'
	import 'nprogress/nprogress.css'
	import { locale } from 'svelte-i18n'
	import type { LayoutServerData } from './$types'
	import { Background } from '$lib/background/background'
	import { BackgroundIndex } from '$lib/background/background_index'
	import { onMount } from 'svelte'

	export let data: LayoutServerData

	const background_index = new BackgroundIndex(data.background_index)
	let current_background = new Background(background_index)
	let next_background = current_background.get_next_background()
	const background_period_duration = data.background_period_duration
	const background_transition_duration = data.background_transition_duration
	let transitioning_background = false

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

		await new Promise((resolve) => setTimeout(resolve, background_transition_duration))
		next_background = next_background.transition_background()
	}

	onMount(() => {
		current_background.transition_background()

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
		<img
			src={next_background.background_url}
			class="absolute w-full h-full pointer-events-none"
			alt="background"
			aria-hidden="true"
		/>
		<img
			src={current_background.background_url}
			class="{transitioning_background
				? 'opacity-0'
				: 'opactiy-100'} transition-all duration-1000 absolute w-full h-full pointer-events-none"
			alt="background"
			aria-hidden="true"
		/>
	</div>

	<slot />
</div>
