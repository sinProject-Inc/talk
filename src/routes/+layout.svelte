<script lang="ts">
	import { browser } from '$app/environment'
	import { afterNavigate } from '$app/navigation'
	import { navigating } from '$app/stores'
	import '$lib/app.css'
	import { Background } from '$lib/background/background'
	import { theme } from '$lib/stores'
	import { Direction } from '$lib/view/direction'
	import { Theme } from '@prisma/client'
	import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
	import NProgress from 'nprogress'
	import 'nprogress/nprogress.css'
	import { locale } from 'svelte-i18n'
	import type { LayoutServerData } from './$types'
	import { onMount } from 'svelte'

	export let data: LayoutServerData

	const background_period_duration = data.background_period_duration
	const background_transition_duration = data.background_transition_duration
	let current_background: Background
	let next_background: Background
	let transitioning_background = false
	let transition_background_timer: number

	const background_dark_overlay = 'rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.9)'
	const background_light_overlay = 'rgba(241, 245, 248, 0.9), rgba(241, 245, 248, 0.9)'

	load_backgrounds()
	polyfillCountryFlagEmojis()

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
		if (transitioning_background) return

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

	function execute_transition(): void {
		clearInterval(transition_background_timer)

		current_background.transition_background()
		next_background = current_background.get_next_background()

		transition_background()

		transition_background_timer = window.setInterval(() => {
			transition_background()
		}, background_period_duration)
	}

	afterNavigate(() => {
		execute_transition()
	})

	let ready = false

	onMount(async () => {
		if (!$theme) {
			if (data.theme === 'system') {
				$theme =
					window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
						? 'dark'
						: 'light'
			} else {
				$theme = data.theme
			}
		}

		ready = true
	})
</script>

<div class="{$theme} {ready ? 'visible' : 'invisible'}">
	<div
		class="min-h-screen bg-cover bg-fixed bg-no-repeat font-sans"
		dir={get_direction($locale ?? '')}
	>
		<div>
			{#if current_background}
				<div class="fixed -z-50 h-screen w-full">
					<div
						style="background: linear-gradient({$theme === Theme.dark
							? background_dark_overlay
							: background_light_overlay}), url({next_background.background_url}) bottom center/cover"
						class="pointer-events-none absolute h-full min-h-screen w-full bg-cover bg-fixed bg-no-repeat"
						aria-hidden="true"
					/>
					<div
						class="{transitioning_background
							? 'opacity-0 transition-all'
							: 'opactiy-100'}  pointer-events-none absolute h-full min-h-screen w-full bg-cover bg-fixed bg-no-repeat"
						style="background: linear-gradient({$theme === Theme.dark
							? background_dark_overlay
							: background_light_overlay}), url({current_background.background_url}) bottom center/cover; transition-duration: {transitioning_background
							? background_transition_duration
							: 0}ms"
						aria-hidden="true"
					/>
				</div>
			{/if}
		</div>
		<slot />
	</div>
</div>
